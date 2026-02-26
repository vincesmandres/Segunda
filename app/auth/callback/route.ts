import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next");

  // Supabase puede devolver errores directamente en la URL de callback
  if (error) {
    console.error("[auth/callback] OAuth error:", error, errorDescription);
    const msg = encodeURIComponent(errorDescription ?? error);
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }

  if (!code) {
    console.warn("[auth/callback] missing code param");
    return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
  }

  try {
    const supabase = await createClientWithCookies();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[auth/callback] exchangeCodeForSession error:", exchangeError.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    const userId = data?.session?.user?.id;

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
          return NextResponse.redirect(`${origin}/profile?onboarding=true`);
        }
      } catch (e) {
        console.error("[auth/callback] profile check error:", e);
        // Si falla la consulta, ir al perfil de todas formas
      }
    }

    return NextResponse.redirect(`${origin}/profile`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "auth_callback_error";
    console.error("[auth/callback] unexpected error:", msg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`);
  }
}
