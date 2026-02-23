import { NextResponse } from "next/server";
import { findRecordByHash } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { hash?: string };
    const hash = body?.hash;

    if (typeof hash !== "string" || !hash.trim()) {
      return NextResponse.json(
        { error: "bad_request", details: "hash es requerido" },
        { status: 400 }
      );
    }

    const record = await findRecordByHash(hash.trim());

    if (record) {
      return NextResponse.json({ valid: true, record }, { status: 200 });
    }

    return NextResponse.json({ valid: false }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
