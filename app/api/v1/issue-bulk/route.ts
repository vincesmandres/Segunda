import { NextResponse } from "next/server";
import { canonicalizePayload, type IssueInput } from "@/lib/canonicalize";
import { hashPayload } from "@/lib/hash";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { saveRecord } from "@/lib/storage";
import {
  getOrCreateSubjectProfile,
  linkCertificateToSubject,
} from "@/lib/subject-profile";

const MAX_BULK_ROWS = 200;

export async function POST(request: Request) {
  try {
    const id = getClientIdentifier(request);
    const rl = checkRateLimit(`issue-bulk:${id}`);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "too_many_requests", details: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
      );
    }
    const body = (await request.json()) as {
      rows?: unknown[];
      issuer_public?: string;
    };
    const rows = body?.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "bad_request", details: "rows debe ser un array no vacío" },
        { status: 400 }
      );
    }
    if (rows.length > MAX_BULK_ROWS) {
      return NextResponse.json(
        {
          error: "bad_request",
          details: `Máximo ${MAX_BULK_ROWS} filas por lote`,
        },
        { status: 400 }
      );
    }

    const issuer_public =
      typeof body.issuer_public === "string" ? body.issuer_public.trim() : null;
    const results: {
      hash: string;
      verify_url: string;
      profile_url: string | null;
      subject_name: string;
      internal_id: string;
      error?: string;
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const input = row as IssueInput;
        const canonical = canonicalizePayload(input);
        const { hash } = hashPayload(canonical);
        const created_at = new Date().toISOString();

        await saveRecord({
          hash,
          payload: canonical,
          created_at,
          anchored: false,
          tx_id: null,
          stellar_url: null,
          issuer_public,
        });

        const subjectProfile = await getOrCreateSubjectProfile(
          canonical.subject_name,
          canonical.internal_id
        );
        await linkCertificateToSubject(subjectProfile.id, hash);

        results.push({
          hash,
          verify_url: `/verify?hash=${hash}`,
          profile_url: `/perfil-certificado/${subjectProfile.token}`,
          subject_name: canonical.subject_name,
          internal_id: canonical.internal_id,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        results.push({
          hash: "",
          verify_url: "",
          profile_url: null,
          subject_name: (row as IssueInput)?.subject_name ?? "",
          internal_id: (row as IssueInput)?.internal_id ?? "",
          error: message,
        });
      }
    }

    return NextResponse.json({ results }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[issue-bulk] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
