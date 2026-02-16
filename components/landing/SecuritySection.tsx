import { Shield, Lock, Eye } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Datos protegidos",
    description: "Encriptación y prácticas alineadas con estándares institucionales.",
  },
  {
    icon: Lock,
    title: "Tú decides",
    description: "Nadie comparte tu score sin tu consentimiento explícito.",
  },
  {
    icon: Eye,
    title: "Transparencia",
    description: "Criterios de cálculo accesibles. Sin algoritmos opacos.",
  },
];

export function SecuritySection() {
  return (
    <section id="seguridad" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold text-[var(--foreground)]">
          Seguridad y privacidad por diseño
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          La confianza que construyes merece la máxima protección. Diseñamos
          procesos y tecnología con privacidad y seguridad desde el inicio.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)]">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                {title}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
