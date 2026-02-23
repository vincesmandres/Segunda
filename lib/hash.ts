import crypto from "crypto";

export function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

export function hashPayload(payload: object): { hash: string; canonical_json: string } {
  const canonical_json = JSON.stringify(payload);
  const hash = sha256Hex(canonical_json);
  return { hash, canonical_json };
}
