import { NextResponse } from "next/server";
import { canonicalizePayload, type IssueInput } from "@/lib/canonicalize";
import { hashPayload } from "@/lib/hash";
import { isIssuerAllowed, isIssuerByProfile } from "@/lib/issuers";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { buildUnsignedAnchorTx } from "@/lib/stellar/tx";
import { saveRecord } from "@/lib/storage";
import {
  getOrCreateSubjectProfile,
  linkCertificateToSubject,
} from "@/lib/subject-profile";
import { createClientWithCookies } from "@/lib/supabase/server";

type IssueRequestBody = IssueInput & { issuer_public?: string };

function isValidStellarPublicKey(s: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(s?.trim() ?? "");
}

export async function POST(request: Request) {
  try {
    const id = getClientIdentifier(request);
    const rl = checkRateLimit(`issue:${id}`);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "too_many_requests", details: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
      );
    }
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

      let profile_token: string | null = null;
      let profile_url: string | null = null;
      try {
        const subjectProfile = await getOrCreateSubjectProfile(
          canonical.subject_name,
          canonical.internal_id
        );
        await linkCertificateToSubject(subjectProfile.id, hash);
        profile_token = subjectProfile.token;
        profile_url = `/perfil-certificado/${subjectProfile.token}`;
      } catch (e) {
        console.warn("[issue] subject profile link failed:", e);
      }

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
          profile_token,
          profile_url,
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

    // BYPASS TEMPORAL: permite cualquier wallet sin verificar DB
    const allowed = true;
    void allowed; // evita warnings de variable no usada

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

    let profile_token: string | null = null;
    let profile_url: string | null = null;
    try {
      const subjectProfile = await getOrCreateSubjectProfile(
        canonical.subject_name,
        canonical.internal_id
      );
      await linkCertificateToSubject(subjectProfile.id, hash);
      profile_token = subjectProfile.token;
      profile_url = `/perfil-certificado/${subjectProfile.token}`;
    } catch (e) {
      console.warn("[issue] subject profile link failed:", e);
    }

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
        profile_token,
        profile_url,
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
