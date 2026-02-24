/**
 * Stellar unsigned transaction building. Server-only.
 */
import "server-only";
import {
  Horizon,
  TransactionBuilder,
  Operation,
  Networks,
  BASE_FEE,
  Transaction,
} from "@stellar/stellar-sdk";

const network = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "public";
export const NETWORK_PASSPHRASE =
  network === "public" ? Networks.PUBLIC : Networks.TESTNET;

const horizonUrl =
  process.env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export function getHorizonServer(): Horizon.Server {
  return new Horizon.Server(horizonUrl);
}

export async function buildUnsignedAnchorTx(params: {
  issuer_public: string;
  hash: string;
}): Promise<{
  unsigned_xdr: string;
  network: "testnet" | "public";
  networkPassphrase: string;
}> {
  const { issuer_public, hash } = params;
  const server = getHorizonServer();

  const account = await server.loadAccount(issuer_public);
  const timebounds = await server.fetchTimebounds(60);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
    timebounds,
  })
    .addOperation(
      Operation.manageData({
        name: "cred_hash",
        value: hash.length <= 64 ? hash : hash.slice(0, 64),
        source: issuer_public,
      })
    )
    .addOperation(
      Operation.manageData({
        name: "app",
        value: "Segunda",
        source: issuer_public,
      })
    )
    .build();

  return {
    unsigned_xdr: transaction.toXDR(),
    network,
    networkPassphrase: NETWORK_PASSPHRASE,
  };
}

export function extractHashFromXDR(signed_xdr: string): string | null {
  try {
    const txOrBump = TransactionBuilder.fromXDR(signed_xdr, NETWORK_PASSPHRASE);
    const tx = "innerTransaction" in txOrBump ? txOrBump.innerTransaction : txOrBump;
    const operations = (tx as Transaction).operations;

    for (const op of operations) {
      const o = op as { type?: string; name?: string; value?: Buffer | string };
      if (o.type === "manageData" && o.name === "cred_hash" && o.value != null) {
        if (Buffer.isBuffer(o.value)) {
          return o.value.toString("utf8");
        }
        return String(o.value);
      }
    }
    return null;
  } catch {
    return null;
  }
}
