"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayError = error || urlError;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      // Usar siempre el origen actual del navegador para evitar mismatches de redirect URL
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
      }
      // Si no hay error, el navegador redirige a Google automáticamente — no llamar setLoading(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-sm w-full space-y-8">
        <h1
          className="text-lg font-[var(--font-pixel)] text-center"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          INICIAR SESIÓN
        </h1>
        <div className="space-y-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Redirigiendo a Google…" : "Continuar con Google"}
          </Button>
          {displayError && (
            <p className="text-sm text-red-600 text-center">{displayError}</p>
          )}
        </div>
        <p className="text-sm text-center text-[var(--black)]/70">
          <Link href="/" className="underline hover:no-underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--black)]/70">Cargando…</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
