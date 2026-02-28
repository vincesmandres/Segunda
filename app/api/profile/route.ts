import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";

/** PATCH: actualizar subject_profile_token para mostrar QR de verificación en el perfil */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClientWithCookies();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "unauthorized", details: "No hay sesión" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { subject_profile_token?: string | null };
    const token =
      body.subject_profile_token === null || body.subject_profile_token === undefined
        ? null
        : typeof body.subject_profile_token === "string"
          ? body.subject_profile_token.trim() || null
          : null;

    const { error } = await supabase
      .from("profiles")
      .update({ subject_profile_token: token })
      .eq("id", user.id);

    if (error) {
      console.error("[profile PATCH]", error.message);
      return NextResponse.json(
        { error: "internal_error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[profile PATCH] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
