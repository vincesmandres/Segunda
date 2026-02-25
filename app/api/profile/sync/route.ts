import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClientWithCookies();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',runId:'pre-fix-profile',hypothesisId:'P1',location:'app/api/profile/sync/route.ts:12',message:'profile/sync auth.getUser',data:{hasUser:!!user,hasAuthError:!!authError},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (authError || !user) {
      return NextResponse.json(
        { error: "unauthorized", details: "No hay sesión" },
        { status: 401 }
      );
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      },
      { onConflict: "id" }
    );

    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',runId:'pre-fix-profile',hypothesisId:'P1',location:'app/api/profile/sync/route.ts:28',message:'profile/sync upsert result',data:{hasError:!!error},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (error) {
      console.error("[profile/sync]", error.message);
      return NextResponse.json(
        { error: "internal_error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[profile/sync] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
