"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useWallet } from "./WalletProvider";

const navLinkClass =
  "inline-flex items-center py-2 px-3 text-xs font-medium font-[var(--font-pixel)] border-2 border-[var(--black)] bg-[var(--white)] text-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)] no-underline";

export function HeaderWithWallet() {
  const { address, isAvailable, networkWarning, connect } = useWallet();
  const isConnected_ = !!address;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8afd1e'},body:JSON.stringify({sessionId:'8afd1e',runId:'pre-fix',hypothesisId:'H1',location:'components/HeaderWithWallet.tsx:17',message:'Header auth init start',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
      // #region agent log
      fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8afd1e'},body:JSON.stringify({sessionId:'8afd1e',runId:'pre-fix',hypothesisId:'H1',location:'components/HeaderWithWallet.tsx:32',message:'Header auth init failed (createClient throw)',data:{error:e instanceof Error ? e.message : String(e)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setUser(null);
    }
    return () => subscription?.unsubscribe();
  }, []);

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
        <button
          type="button"
          onClick={connect}
          disabled={isAvailable === false}
          className={`${walletButtonBase} ${walletButtonStyles}`}
        >
          {isConnected_ ? `Conectado: ${address.slice(0, 8)}…` : "Conectar Freighter"}
        </button>
      </nav>
    </header>
  );
}
