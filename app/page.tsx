import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-6">
            <h1
              className="text-2xl sm:text-3xl font-[var(--font-pixel)] text-[var(--black)]"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              SEGUNDA
            </h1>
            <p className="text-lg text-[var(--black)]/90 leading-relaxed max-w-xl mx-auto">
              Emisión y verificación de certificados. Simple y verificable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/issue" variant="primary">
              Emitir
            </Button>
            <Button href="/verify" variant="secondary">
              Verificar
            </Button>
          </div>
        </div>

        <section className="max-w-2xl w-full mt-24 px-4">
          <h2
            className="text-lg font-[var(--font-pixel)] text-[var(--black)] mb-8"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            HOW IT WORKS
          </h2>
          <ul className="space-y-8 text-left">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 border-2 border-[var(--black)] bg-[var(--white)] flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <strong className="block mb-1">Emitir</strong>
                <p className="text-[var(--black)]/80 leading-relaxed">
                  Completa el formulario con los datos del certificado y genera un hash único.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 border-2 border-[var(--black)] bg-[var(--white)] flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <strong className="block mb-1">Compartir</strong>
                <p className="text-[var(--black)]/80 leading-relaxed">
                  Usa el link de verificación o copia el hash para que otros puedan validarlo.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 border-2 border-[var(--black)] bg-[var(--white)] flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <strong className="block mb-1">Verificar</strong>
                <p className="text-[var(--black)]/80 leading-relaxed">
                  Introduce el hash y obtén el resultado: válido o inválido con los detalles.
                </p>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t-2 border-[var(--black)] py-6 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--black)] hover:underline"
          >
            Segunda
          </Link>
          <p className="text-sm text-[var(--black)]/70">MVP</p>
        </div>
      </footer>
    </div>
  );
}
