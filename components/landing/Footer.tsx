import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--foreground)]">Segunda</span>
          <span className="text-sm text-[var(--muted)]">
            Infraestructura de confianza
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[var(--muted)]">
          <Link href="/#seguridad" className="hover:text-[var(--foreground)]">
            Seguridad
          </Link>
          <Link href="#" className="hover:text-[var(--foreground)]">
            Aviso legal
          </Link>
          <Link href="#" className="hover:text-[var(--foreground)]">
            Privacidad
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Segunda. Construye confianza financiera, sin deuda.
      </p>
    </footer>
  );
}
