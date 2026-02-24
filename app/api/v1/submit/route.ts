import { NextResponse } from "next/server";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import {
  getHorizonServer,
  extractHashFromXDR,
  getSourceAccountFromXDR,
  NETWORK_PASSPHRASE,
} from "@/lib/stellar/tx";
import { findRecordByHash, updateRecordByHash } from "@/lib/storage";

const STELLAR_EXPERT_BASE = {
  testnet: "https://stellar.expert/explorer/testnet/tx",
  public: "https://stellar.expert/explorer/public/tx",
} as const;

const network = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "public";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { hash?: string; signed_xdr?: string };
    const hash = typeof body.hash === "string" ? body.hash.trim() : "";
    const signed_xdr = typeof body.signed_xdr === "string" ? body.signed_xdr.trim() : "";

    if (!hash || !signed_xdr) {
      return NextResponse.json(
        { error: "bad_request", details: "hash y signed_xdr son requeridos" },
        { status: 400 }
      );
    }

    const record = await findRecordByHash(hash);
    if (!record) {
      return NextResponse.json(
        { error: "not_found", details: "No existe un record con ese hash" },
        { status: 404 }
      );
    }

    // Idempotencia: si ya está anchored con tx_id, devolver 200 con datos existentes
    if (record.anchored && record.tx_id && record.stellar_url) {
      return NextResponse.json({
        anchored: true,
        tx_id: record.tx_id,
        stellar_url: record.stellar_url,
      });
    }

    const extractedHash = extractHashFromXDR(signed_xdr);
    if (extractedHash !== hash) {
      return NextResponse.json(
        { error: "bad_request", details: "El hash en la transacción no coincide con el hash indicado" },
        { status: 400 }
      );
    }

    // Verificar que el source account del XDR coincida con issuer_public en DB
    if (record.issuer_public) {
      const source = getSourceAccountFromXDR(signed_xdr, NETWORK_PASSPHRASE);
      if (source !== record.issuer_public) {
        return NextResponse.json(
          { error: "bad_request", details: "source_account_mismatch" },
          { status: 400 }
        );
      }
    }

    const server = getHorizonServer();
    const tx = TransactionBuilder.fromXDR(signed_xdr, NETWORK_PASSPHRASE);

    const response = await server.submitTransaction(tx);
    const tx_id = response.hash;
    const baseUrl = STELLAR_EXPERT_BASE[network] ?? STELLAR_EXPERT_BASE.testnet;
    const stellar_url = `${baseUrl}/${tx_id}`;

    await updateRecordByHash(hash, {
      anchored: true,
      tx_id,
      stellar_url,
    });

    return NextResponse.json({
      anchored: true,
      tx_id,
      stellar_url,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[submit] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
