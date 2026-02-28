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
