import { NextResponse } from "next/server";
import { canonicalizePayload, type IssueInput } from "@/lib/canonicalize";
import { hashPayload } from "@/lib/hash";
import { isIssuerAllowed, isIssuerByProfile } from "@/lib/issuers";
import { buildUnsignedAnchorTx } from "@/lib/stellar/tx";
import { saveRecord } from "@/lib/storage";
import { createClientWithCookies } from "@/lib/supabase/server";

type IssueRequestBody = IssueInput & { issuer_public?: string };

function isValidStellarPublicKey(s: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(s?.trim() ?? "");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IssueRequestBody;
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    let canonical;
    try {
      canonical = canonicalizePayload(body);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return NextResponse.json(
        { error: "bad_request", details: message },
        { status: 400 }
      );
    }

    const { hash } = hashPayload(canonical);
    const created_at = new Date().toISOString();

    if (!body.issuer_public) {
      if (!demoMode) {
        return NextResponse.json(
          { error: "bad_request", details: "issuer_public requerido para anchoring" },
          { status: 400 }
        );
      }

      const record = {
        hash,
        payload: canonical,
        created_at,
        anchored: false,
        tx_id: null as string | null,
        stellar_url: null as string | null,
        issuer_public: null as string | null,
      };
      await saveRecord(record);

      return NextResponse.json(
        {
          hash,
          verify_url: `/verify?hash=${hash}`,
          created_at,
          anchored: false,
          tx_id: null,
          stellar_url: null,
          issuer_public: null,
          unsigned_xdr: null,
          network: (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "public",
        },
        { status: 201 }
      );
    }

    const issuer_public = String(body.issuer_public).trim();
    if (!isValidStellarPublicKey(issuer_public)) {
      return NextResponse.json(
        { error: "bad_request", details: "issuer_public inválido (debe ser public key G...)" },
        { status: 400 }
      );
    }

    let allowed = await isIssuerAllowed(issuer_public);
    if (!allowed) {
      const supabase = await createClientWithCookies();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        allowed = await isIssuerByProfile(issuer_public, user.id);
      }
    }
    if (!allowed) {
      return NextResponse.json(
        { error: "forbidden", details: "issuer_not_allowed" },
        { status: 403 }
      );
    }

    let unsigned_xdr: string;
    let network: "testnet" | "public";
    try {
      const built = await buildUnsignedAnchorTx({ issuer_public, hash });
      unsigned_xdr = built.unsigned_xdr;
      network = built.network;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("[issue] Horizon/buildUnsignedAnchorTx:", message);
      return NextResponse.json(
        { error: "internal_error", details: message },
        { status: 500 }
      );
    }

    const record = {
      hash,
      payload: canonical,
      created_at,
      anchored: false,
      tx_id: null as string | null,
      stellar_url: null as string | null,
      issuer_public,
    };
    await saveRecord(record);

    return NextResponse.json(
      {
        hash,
        verify_url: `/verify?hash=${hash}`,
        created_at,
        anchored: false,
        tx_id: null,
        stellar_url: null,
        issuer_public,
        unsigned_xdr,
        network,
      },
      { status: 201 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[issue] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
