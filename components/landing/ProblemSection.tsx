import { Card } from "@/components/ui";
import { BarChart3 } from "lucide-react";

export function ProblemSection() {
  return (
    <section id="problema" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              El problema
            </h2>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              La reputación financiera suele depender de historiales de crédito opacos,
              puntuaciones que no controlas y deuda como única vía de demostrar solvencia.
              No existe un estándar portable que refleje hábitos consistentes sin
              exponerte a más préstamos.
            </p>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              Segunda ofrece una alternativa: un score basado en comportamiento,
              transparente y que tú puedes compartir cuando quieras.
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="w-full max-w-sm">
              <div className="flex flex-col items-center gap-4 py-4">
                <BarChart3 className="h-12 w-12 text-[var(--muted)]" strokeWidth={1.5} />
                <p className="text-center text-sm text-[var(--muted)]">
                  Vista previa de Trust Dashboard
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="text-[var(--muted)]">Score</span>
                  <span className="font-medium text-[var(--primary)]">742</span>
                </div>
                <div className="h-px w-full bg-[var(--border)]" />
                <div className="grid w-full grid-cols-2 gap-2 text-xs text-[var(--muted)]">
                  <span>Consistencia</span>
                  <span className="text-right">87%</span>
                  <span>Estabilidad</span>
                  <span className="text-right">92%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
