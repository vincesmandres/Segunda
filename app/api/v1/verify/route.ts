import { NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { findRecordByHash } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const id = getClientIdentifier(request);
    const rl = checkRateLimit(`verify:${id}`);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "too_many_requests", details: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
      );
    }
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
      const network = (process.env.STELLAR_NETWORK ?? "testnet") as "testnet" | "public";
      return NextResponse.json({ valid: true, record, network }, { status: 200 });
    }

    return NextResponse.json({ valid: false }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[verify] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
