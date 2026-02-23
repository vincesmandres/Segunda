/**
 * Stellar anchoring. SOLO para backend (API routes, Server Actions).
 * NO importar desde client components.
 */
import "server-only";

import {
  Horizon,
  Keypair,
  TransactionBuilder,
  Operation,
  Memo,
  Asset,
  Networks,
} from "@stellar/stellar-sdk";

export type StellarAnchorResult = {
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
  network: "testnet" | "public";
  error?: string;
};

const STELLAR_EXPERT_BASE = {
  testnet: "https://stellar.expert/explorer/testnet/tx",
  public: "https://stellar.expert/explorer/public/tx",
};

function getNetworkPassphrase(network: string): string {
  return network === "public" ? Networks.PUBLIC : Networks.TESTNET;
}

export async function anchorHashOnStellar(hashHex: string): Promise<StellarAnchorResult> {
  const secret = process.env.STELLAR_ISSUER_SECRET?.trim();
  const horizonUrl = process.env.STELLAR_HORIZON_URL?.trim();
  const network = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "public";

  if (!secret || !horizonUrl) {
    return {
      anchored: false,
      tx_id: null,
      stellar_url: null,
      network,
      error: "stellar_not_configured",
    };
  }

  try {
    const server = new Horizon.Server(horizonUrl);
    const keypair = Keypair.fromSecret(secret);
    const issuerPublic = keypair.publicKey();

    const account = await server.loadAccount(issuerPublic);

    const passphrase = getNetworkPassphrase(network);
    const fee = await server.fetchBaseFee();
    const timebounds = await server.fetchTimebounds(60);

    let memo;
    const hashBytes = Buffer.from(hashHex, "hex");
    if (hashBytes.length === 32) {
      memo = Memo.hash(hashHex);
    } else {
      const text = hashHex.slice(0, 28);
      memo = Memo.text(text);
    }

    const transaction = new TransactionBuilder(account, {
      fee: String(fee),
      networkPassphrase: passphrase,
      timebounds,
    })
      .addMemo(memo)
      .addOperation(
        Operation.manageData({
          name: "hash",
          value: hashHex.length <= 64 ? hashHex : hashHex.slice(0, 64),
          source: issuerPublic,
        })
      )
      .setTimeout(60)
      .build();

    transaction.sign(keypair);

    const response = await server.submitTransaction(transaction);
    const txId = response.hash;
    const baseUrl = STELLAR_EXPERT_BASE[network] ?? STELLAR_EXPERT_BASE.testnet;
    const stellarUrl = `${baseUrl}/${txId}`;

    return {
      anchored: true,
      tx_id: txId,
      stellar_url: stellarUrl,
      network,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const extras =
      err && typeof err === "object" && "response" in err
        ? JSON.stringify((err as { response?: unknown }).response)
        : "";
    return {
      anchored: false,
      tx_id: null,
      stellar_url: null,
      network,
      error: extras ? `${message} | ${extras}` : message,
    };
  }
}
