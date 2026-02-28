"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useWallet } from "./WalletProvider";

const navLinkClass =
  "inline-flex items-center py-2 px-3 text-xs font-medium font-[var(--font-pixel)] border-2 border-[var(--black)] bg-[var(--white)] text-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)] no-underline";

export function HeaderWithWallet() {
  const { address, isAvailable, networkWarning, connect, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [profileWallet, setProfileWallet] = useState<string | null>(null);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = sub.data.subscription;
    } catch (e) {
      setUser(null);
    }
    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfileWallet = useCallback(() => {
    if (!user?.id) {
      setProfileWallet(null);
      return;
    }
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("wallet_public")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setProfileWallet(data?.wallet_public?.trim() || null);
      })
      .catch(() => setProfileWallet(null));
  }, [user?.id]);

  useEffect(() => {
    fetchProfileWallet();
  }, [fetchProfileWallet]);

  useEffect(() => {
    const onProfileWalletUpdate = () => fetchProfileWallet();
    window.addEventListener("segunda-profile-wallet-updated", onProfileWalletUpdate);
    return () => window.removeEventListener("segunda-profile-wallet-updated", onProfileWalletUpdate);
  }, [fetchProfileWallet]);

  const hasFreighter = !!address;
  const hasLinkedWallet = !!profileWallet;
  const displayAddress = address || profileWallet || "";
  const isConnected_ = !!displayAddress;

  const walletButtonBase =
    "inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium transition-all duration-75 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--black)] focus:ring-offset-2 disabled:opacity-50 font-[var(--font-pixel)] tracking-wide select-none rounded-none";

  const walletButtonStyles = isConnected_
    ? "bg-emerald-600 text-white border-2 border-emerald-700 shadow-[4px_4px_0_0_var(--black)] hover:bg-emerald-700 active:shadow-[1px_1px_0_0_var(--black)]"
    : "bg-[var(--white)] text-[var(--black)] border-2 border-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)] active:shadow-[1px_1px_0_0_var(--black)]";

  return (
    <header className="border-b-2 border-[var(--black)] py-4 px-6 flex items-center justify-between">
      <Link
        href="/"
        className="font-[var(--font-pixel)] text-sm"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        SEGUNDA
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="/issue" className={navLinkClass}>
          Emitir
        </Link>
        <Link href="/emitir-lote" className={navLinkClass}>
          Lote (CSV)
        </Link>
        <Link href="/verify" className={navLinkClass}>
          Verificar
        </Link>
        {user ? (
          <>
            <Link href="/profile" className={navLinkClass}>
              Perfil
            </Link>
            <a href="/logout" className={navLinkClass}>
              Salir
            </a>
          </>
        ) : (
          <Link href="/login" className={navLinkClass}>
            Entrar
          </Link>
        )}
        {networkWarning && (
          <span
            className="text-xs text-amber-700 max-w-[160px] truncate"
            title={networkWarning}
          >
            {networkWarning}
          </span>
        )}
        {isConnected_ ? (
          <>
            <span
              className={`${walletButtonBase} bg-emerald-600 text-white border-2 border-emerald-700 shadow-[4px_4px_0_0_var(--black)]`}
              title={displayAddress}
            >
              {hasFreighter ? "Conectado" : "Vinculada"}: {displayAddress.slice(0, 8)}…
            </span>
            {hasFreighter ? (
              <button
                type="button"
                onClick={disconnect}
                className={`${walletButtonBase} bg-[var(--white)] text-[var(--black)] border-2 border-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)] active:shadow-[1px_1px_0_0_var(--black)]`}
              >
                Desconectar Wallet
              </button>
            ) : (
              <button
                type="button"
                onClick={connect}
                disabled={isAvailable === false}
                className={`${walletButtonBase} bg-[var(--white)] text-[var(--black)] border-2 border-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)]`}
              >
                Conectar Freighter
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={connect}
            disabled={isAvailable === false}
            className={`${walletButtonBase} ${walletButtonStyles}`}
          >
            Conectar Freighter
          </button>
        )}
      </nav>
    </header>
  );
}
