"use client";

import { useEffect, useState } from "react";
import { LoginWithGoogle } from "./LoginWithGoogle";

const STORAGE_KEY = "segunda_mock_session";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(!!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-[var(--muted)]">Cargando…</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <LoginWithGoogle onLogin={() => setLoggedIn(true)} />;
  }

  return <>{children}</>;
}
