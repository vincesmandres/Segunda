import { NextResponse } from "next/server";
import { getIssuerStatus, isIssuerByProfile } from "@/lib/issuers";
import { createClientWithCookies } from "@/lib/supabase/server";

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

    let profileAllowed = false;
    let hasUser = false;
    try {
      const supabase = await createClientWithCookies();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      hasUser = !!user?.id;
      if (user?.id) {
        profileAllowed = await isIssuerByProfile(issuer_public, user.id);
      }
      // #region agent log
      console.log("[DEBUG issuer-status] auth", { hasUser, profileAllowed, issuerSuffix: issuer_public.slice(-6) });
      // #endregion
    } catch {
      profileAllowed = false;
    }

    const baseStatus = await getIssuerStatus(issuer_public);
    const allowed = baseStatus.allowed || profileAllowed;
    // #region agent log
    console.log("[DEBUG issuer-status] result", { baseAllowed: baseStatus.allowed, profileAllowed, allowed });
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
