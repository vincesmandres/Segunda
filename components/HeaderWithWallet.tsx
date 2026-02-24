"use client";

import Link from "next/link";
import { useWallet } from "./WalletProvider";

export function HeaderWithWallet() {
  const { address, isAvailable, networkWarning, connect } = useWallet();
  const isConnected_ = !!address;

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
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
