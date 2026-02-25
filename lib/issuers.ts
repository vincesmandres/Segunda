import "server-only";
import { getSupabaseAdmin } from "./supabase-server";

export async function isIssuerAllowed(issuer_public: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("issuers")
      .select("status")
      .eq("issuer_public", issuer_public.trim())
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[issuers] isIssuerAllowed error:", error.message);
      return false;
    }
    return !!data;
  } catch (e) {
    console.error("[issuers] isIssuerAllowed:", e);
    return false;
  }
}

export type IssuerStatusResult = {
  allowed: boolean;
  status?: string;
  display_name?: string;
};

/**
 * Verifica si el usuario logueado tiene role='issuer' y su wallet_public coincide.
 * Permite emisión sin estar en la whitelist de issuers.
 */
export async function isIssuerByProfile(
  issuer_public: string,
  userId: string
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("role, wallet_public")
      .eq("id", userId)
      .eq("role", "issuer")
      .eq("wallet_public", issuer_public.trim())
      .limit(1)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch (e) {
    console.error("[issuers] isIssuerByProfile:", e);
    return false;
  }
}

export async function getIssuerStatus(issuer_public: string): Promise<IssuerStatusResult> {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',runId:'pre-fix-issuers',hypothesisId:'H1',location:'lib/issuers.ts:60',message:'getIssuerStatus start',data:{issuerPublicSuffix:issuer_public.slice(-6)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("issuers")
      .select("status, display_name")
      .eq("issuer_public", issuer_public.trim())
      .limit(1)
      .maybeSingle();

    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',runId:'pre-fix-issuers',hypothesisId:'H1',location:'lib/issuers.ts:67',message:'getIssuerStatus db result',data:{hasError:!!error,hasData:!!data,status:data?.status},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (error || !data) {
      return { allowed: false };
    }
    return {
      allowed: data.status === "active",
      status: data.status,
      display_name: data.display_name,
    };
  } catch (e) {
    console.error("[issuers] getIssuerStatus:", e);
    return { allowed: false };
  }
}
