import { NextResponse } from "next/server";
import { getSubjectProfileByToken } from "@/lib/subject-profile";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token?.trim()) {
      return NextResponse.json(
        { error: "bad_request", details: "token es requerido" },
        { status: 400 }
      );
    }
    const { profile, certificates } = await getSubjectProfileByToken(token);
    if (!profile) {
      return NextResponse.json(
        { error: "not_found", details: "Perfil no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      profile: {
        token: profile.token,
        subject_name: profile.subject_name,
        internal_id: profile.internal_id,
        created_at: profile.created_at,
      },
      certificates,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[subject-profile] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
