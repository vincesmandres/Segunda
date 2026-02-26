import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  try {
    if (!code) {
      return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
    }

    const supabase = await createClientWithCookies();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`);
    }

    const userId = data?.session?.user?.id;

    // Si se especificó un destino explícito, respetar
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Verificar si el usuario ya tiene wallet configurada
    if (userId) {
      try {
        const admin = getSupabaseAdmin();
        const { data: profile } = await admin
          .from("profiles")
          .select("wallet_public")
          .eq("id", userId)
          .maybeSingle();

        if (!profile?.wallet_public) {
          // Primera vez o sin wallet → onboarding
          return NextResponse.redirect(`${origin}/profile?onboarding=true`);
        }
      } catch {
        // Si falla la consulta, ir igual al perfil sin onboarding
      }
    }

    return NextResponse.redirect(`${origin}/profile`);
  } catch (e) {
    console.error("[auth/callback] unexpected error", e instanceof Error ? e.message : String(e));
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }
}
