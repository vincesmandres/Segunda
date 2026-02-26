import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  try {
    console.log("[auth/callback] hit", {
      url: request.url,
      hasCode: !!code,
      next,
      rawQuery: searchParams.toString(),
    });

    if (!code) {
      console.warn("[auth/callback] missing code param", {
        searchParams: searchParams.toString(),
      });
      return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
    }

    const supabase = await createClientWithCookies();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error", {
        message: error.message,
        name: error.name,
        status: (error as { status?: number }).status,
      });
      return NextResponse.redirect(
        `${origin}/login?error=auth_exchange_failed`
      );
    }

    console.log("[auth/callback] exchangeCodeForSession success", {
      userId: data?.session?.user?.id,
    });

    return NextResponse.redirect(`${origin}${next}`);
  } catch (e) {
    console.error("[auth/callback] unexpected error", {
      error: e instanceof Error ? e.message : String(e),
    });
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }
}
