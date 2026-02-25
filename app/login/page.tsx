"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "/auth/callback";
      // Log mínimo para inspeccionar el redirect en el navegador
      console.log("[login] signInWithOAuth", { redirectTo });
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
    } finally {
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
            {loading ? "Cargando…" : "Continuar con Google"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
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
