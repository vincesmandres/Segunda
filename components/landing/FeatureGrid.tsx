import { Cpu, Gauge, Share2 } from "lucide-react";
import { Card } from "@/components/ui";

const features = [
  {
    icon: Cpu,
    title: "Motor de confianza conductual",
    description:
      "Analizamos patrones de comportamiento financiero para generar una señal de confianza objetiva y actualizable.",
  },
  {
    icon: Gauge,
    title: "Score transparente",
    description:
      "Tu puntuación se calcula con criterios claros. Sin cajas negras: sabes qué impulsa tu reputación.",
  },
  {
    icon: Share2,
    title: "Reputación portable",
    description:
      "Lleva tu Trust Passport donde lo necesites: verificación con terceros sin compartir datos sensibles.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-2xl font-normal text-[var(--foreground)] sm:text-3xl md:text-4xl">
          Infraestructura de confianza
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">
          Tres pilares para una reputación financiera portable y verificable.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} as="article">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display mt-4 text-lg font-normal text-[var(--foreground)]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
