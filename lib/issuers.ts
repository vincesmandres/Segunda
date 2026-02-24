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

export async function getIssuerStatus(issuer_public: string): Promise<IssuerStatusResult> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("issuers")
      .select("status, display_name")
      .eq("issuer_public", issuer_public.trim())
      .limit(1)
      .maybeSingle();

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
