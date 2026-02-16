import { Cpu, Gauge, Share2 } from "lucide-react";
import { Card } from "@/components/ui";

const items = [
  {
    icon: Cpu,
    title: "Motor de confianza",
    description:
      "Analizamos patrones para generar una señal objetiva y actualizable.",
  },
  {
    icon: Gauge,
    title: "Score transparente",
    description:
      "Puntuación con criterios claros. Sin cajas negras: sabes qué impulsa tu reputación.",
  },
  {
    icon: Share2,
    title: "Passport portable",
    description:
      "Lleva tu Trust Passport donde lo necesites. Verificación con terceros sin compartir datos sensibles.",
  },
];

export function SolutionSection() {
  return (
    <section id="solucion" className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-[var(--foreground)]">
          La solución
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[var(--muted)]">
          Tres pilares para una reputación portable y verificable.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4">
          {items.map(({ icon: Icon, title, description }) => (
            <Card key={title} as="article" className="flex flex-row items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)]">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                  {description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
