import { NextResponse } from "next/server";
import { getIssuerStatus } from "@/lib/issuers";

function isValidStellarPublicKey(s: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(s?.trim() ?? "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const issuer_public = searchParams.get("issuer_public")?.trim() ?? "";

    if (!issuer_public || !isValidStellarPublicKey(issuer_public)) {
      return NextResponse.json(
        { error: "bad_request", details: "issuer_public requerido y debe ser una public key G..." },
        { status: 400 }
      );
    }

    const result = await getIssuerStatus(issuer_public);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[issuer-status] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
