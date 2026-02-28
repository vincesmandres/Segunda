import { NextResponse } from "next/server";
import { getIssuerStatus, isIssuerByProfile } from "@/lib/issuers";
import { createClientWithCookies } from "@/lib/supabase/server";

function isValidStellarPublicKey(s: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(s?.trim() ?? "");
}

export async function GET(request: Request) {
  // BYPASS TEMPORAL: permite cualquier wallet sin verificar DB
  const { searchParams: sp } = new URL(request.url);
  const _raw = sp.get("issuer_public")?.trim() ?? "";
  if (_raw) {
    return NextResponse.json({ allowed: true, status: "active", display_name: "Cualquier Usuario" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const issuer_public = searchParams.get("issuer_public")?.trim() ?? "";

    if (!issuer_public || !isValidStellarPublicKey(issuer_public)) {
      return NextResponse.json(
        { error: "bad_request", details: "issuer_public requerido y debe ser una public key G..." },
        { status: 400 }
      );
    }

    let profileAllowed = false;
    let hasUser = false;
<<<<<<< HEAD
    let authErrMsg: string | null = null;
=======
>>>>>>> origin/feature/certificate-record-qr-bulk
    try {
      const supabase = await createClientWithCookies();
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      hasUser = !!user?.id;
<<<<<<< HEAD
      authErrMsg = authErr?.message ?? null;
=======
>>>>>>> origin/feature/certificate-record-qr-bulk
      if (user?.id) {
        profileAllowed = await isIssuerByProfile(issuer_public, user.id);
      }
      // #region agent log
<<<<<<< HEAD
      fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4b702e' }, body: JSON.stringify({ sessionId: '4b702e', location: 'issuer-status/route.ts:30', message: 'auth result', data: { hasUser, profileAllowed, authErrMsg, walletSuffix: issuer_public.slice(-8) }, timestamp: Date.now() }) }).catch(() => { });
      // #endregion
    } catch (e) {
      authErrMsg = e instanceof Error ? e.message : String(e);
=======
      console.log("[DEBUG issuer-status] auth", { hasUser, profileAllowed, issuerSuffix: issuer_public.slice(-6) });
      // #endregion
    } catch {
>>>>>>> origin/feature/certificate-record-qr-bulk
      profileAllowed = false;
      // #region agent log
      fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4b702e' }, body: JSON.stringify({ sessionId: '4b702e', location: 'issuer-status/route.ts:catch', message: 'auth exception', data: { authErrMsg }, timestamp: Date.now() }) }).catch(() => { });
      // #endregion
    }

    const baseStatus = await getIssuerStatus(issuer_public);
    const allowed = baseStatus.allowed || profileAllowed;
    // #region agent log
<<<<<<< HEAD
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4b702e' }, body: JSON.stringify({ sessionId: '4b702e', location: 'issuer-status/route.ts:final', message: 'final result', data: { baseAllowed: baseStatus.allowed, profileAllowed, allowed, status: baseStatus.status }, timestamp: Date.now() }) }).catch(() => { });
=======
    console.log("[DEBUG issuer-status] result", { baseAllowed: baseStatus.allowed, profileAllowed, allowed });
>>>>>>> origin/feature/certificate-record-qr-bulk
    // #endregion
    const status =
      baseStatus.allowed
        ? baseStatus.status
        : profileAllowed
          ? "profile_issuer"
          : baseStatus.status;

    const result = {
      allowed,
      status,
      display_name: baseStatus.display_name,
    };

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
