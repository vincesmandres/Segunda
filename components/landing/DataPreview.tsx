"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Shield, Zap } from "lucide-react";
import { Card } from "@/components/ui";
import { MOCK_TRUST_SCORE } from "@/lib/mock-trust";

export function DataPreview() {
  const [score, setScore] = useState(MOCK_TRUST_SCORE.score - 20);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => {
      setScore((s) => (s >= MOCK_TRUST_SCORE.score ? s : s + 2));
    }, 80);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-center text-2xl font-normal text-[var(--foreground)] sm:text-3xl">
          Trust Dashboard
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-[var(--muted)] text-sm">
          Vista previa de cómo se presenta tu reputación financiera.
        </p>
        <Card className="mt-10 overflow-hidden">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl bg-white/5 p-6 text-center">
              <span className="font-mono text-4xl font-bold tabular-nums text-[var(--accent)] transition-all duration-300 sm:text-5xl">
                {mounted ? score : "—"}
              </span>
              <span className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                Trust Score
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 p-6 text-center">
              <span className="font-mono text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                {MOCK_TRUST_SCORE.level}
              </span>
              <span className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                Nivel
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 p-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Riesgo bajo</span>
              </div>
              <span className="text-xs text-[var(--muted)]">Señal de riesgo</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-6">
            <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <Shield className="h-4 w-4 text-[var(--neon-purple)]" />
              Consistencia {MOCK_TRUST_SCORE.consistency}%
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <Zap className="h-4 w-4 text-[var(--accent)]" />
              Estabilidad {MOCK_TRUST_SCORE.stability}%
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
