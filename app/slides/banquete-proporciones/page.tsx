import Link from "next/link";
import { BANQUETE_SECTIONS } from "@/lib/slides/banquete-sections";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";

export default function BanqueteIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1
          className="text-2xl sm:text-3xl font-[var(--font-pixel)] text-[var(--black)] mb-4"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          El Banquete de las Proporciones
        </h1>
        <p className="text-lg text-[var(--black)]/80">
          Polypad + Wayground · EGB Media/Superior · Fracciones, razones y proporcionalidad
        </p>
        <p className="text-sm text-[var(--black)]/60 mt-2">
          Informe técnico de innovación: estrategias y recursos didácticos inclusivos en matemática
        </p>
      </header>

      <ul className="space-y-4 list-none p-0 m-0">
        {BANQUETE_SECTIONS.map((section, i) => (
          <li key={section.id}>
            <Link href={section.path} className="block no-underline group">
              <Card as="div" className="group-hover:shadow-[6px_6px_0_0_var(--black)] transition-shadow">
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 w-10 h-10 border-2 border-[var(--black)] bg-[var(--white)] flex items-center justify-center text-sm font-[var(--font-pixel)]">
                    {i + 1}
                  </span>
                  <span className="text-[var(--black)] font-medium">{section.title}</span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <Button href={BANQUETE_SECTIONS[0].path} variant="primary">
          Comenzar por la Introducción
        </Button>
      </div>
    </main>
  );
}
