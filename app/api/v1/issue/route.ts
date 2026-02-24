import { NextResponse } from "next/server";
import { canonicalizePayload, type IssueInput } from "@/lib/canonicalize";
import { hashPayload } from "@/lib/hash";
import { anchorHashOnStellar } from "@/lib/stellar";
import { saveRecord } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IssueInput;

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
    const stellar = await anchorHashOnStellar(hash);

    const record = {
      hash,
      payload: canonical,
      created_at: new Date().toISOString(),
      anchored: stellar.anchored,
      tx_id: stellar.tx_id,
      stellar_url: stellar.stellar_url,
    };

    await saveRecord(record);

    return NextResponse.json(
      {
        hash,
        verify_url: `/verify?hash=${hash}`,
        created_at: record.created_at,
        anchored: record.anchored,
        tx_id: record.tx_id,
        stellar_url: record.stellar_url,
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
