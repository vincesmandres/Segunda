import { Card } from "@/components/ui";
import { Target, Eye, Shield } from "lucide-react";

export function About() {
  return (
    <section id="sobre-nosotros" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-center text-2xl font-normal text-[var(--foreground)] sm:text-3xl md:text-4xl">
          Sobre el proyecto
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted)]">
          Qué es Segunda y por qué existe.
        </p>

        <Card className="mt-10 space-y-8">
          <p className="text-lg leading-relaxed text-[var(--foreground)]">
            <strong className="text-[var(--accent)]">Segunda</strong> es una plataforma de
            infraestructura de confianza. No somos un prestamista: no damos crédito
            ni cobramos intereses. Nuestro objetivo es que tu historial de hábitos
            financieros consistentes se convierta en una reputación verificable y
            portable — un <em>Trust Passport</em> — que puedas usar donde lo necesites.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Creemos que la confianza se puede medir de forma transparente. Por eso
            construimos un score basado en comportamiento, criterios claros y datos
            que tú puedes entender y compartir bajo tu control. El futuro no es
            más deuda; es más reputación.
          </p>

          <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-3 font-normal text-[var(--foreground)]">
                Misión
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Hacer la reputación financiera accesible y portable para todos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-3 font-normal text-[var(--foreground)]">
                Transparencia
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Criterios claros, sin cajas negras. Tú sabes qué impulsa tu score.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-3 font-normal text-[var(--foreground)]">
                Control
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Tú decides con quién compartir tu Trust Passport y para qué.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
