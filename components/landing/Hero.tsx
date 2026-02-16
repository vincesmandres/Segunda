import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
          Construye confianza financiera. Sin deuda.
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)]">
          Transforma tus hábitos financieros en una reputación portable y verificable.
          No prestamos dinero; construimos infraestructura de confianza.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/dashboard" variant="primary">
            Ver mi Trust Score
          </Button>
          <Button href="/profile" variant="secondary">
            Configurar perfil
          </Button>
        </div>
      </div>
    </section>
  );
}
