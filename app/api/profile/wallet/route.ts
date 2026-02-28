import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";

function isValidStellarPublicKey(s: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(s?.trim() ?? "");
}

export async function POST(request: Request) {
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

    const body = (await request.json()) as { wallet_public?: string | null };
    const rawWallet =
      typeof body.wallet_public === "string" ? body.wallet_public.trim() : null;

    if (rawWallet && !isValidStellarPublicKey(rawWallet)) {
      return NextResponse.json(
        { error: "bad_request", details: "wallet_public inválido (debe ser G...)" },
        { status: 400 }
      );
    }

    // Obtener rol actual para no bajar de admin
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Al vincular wallet, marcar como issuer siempre (salvo si ya es admin)
    let nextRole: string | null = profileRow?.role ?? null;
    if (rawWallet) {
      nextRole = profileRow?.role === "admin" ? "admin" : "issuer";
    }

    const update: { wallet_public: string | null; role?: string } = {
      wallet_public: rawWallet || null,
    };
    if (nextRole != null && nextRole !== profileRow?.role) {
      update.role = nextRole;
    }
    // #region agent log
<<<<<<< HEAD
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',location:'profile/wallet/route.ts:54',message:'wallet link payload',data:{hasWallet:!!rawWallet,walletSuffix:rawWallet?.slice(-8)??null,nextRole,updateRole:update.role,prevRole:profileRow?.role??null},timestamp:Date.now()})}).catch(()=>{});
=======
    console.log("[DEBUG profile/wallet] update payload", { hasWallet: !!rawWallet, nextRole, updateRole: update.role });
>>>>>>> origin/feature/certificate-record-qr-bulk
    // #endregion

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", user.id);

    if (error) {
      console.error("[profile/wallet]", error.message);
      return NextResponse.json(
        { error: "internal_error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[profile/wallet] 500:", message);
    return NextResponse.json(
      { error: "internal_error", details: message },
      { status: 500 }
    );
  }
}
