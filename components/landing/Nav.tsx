import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
        >
          Segunda
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/#problema"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Problema
          </Link>
          <Link
            href="/#solucion"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Solución
          </Link>
          <Link
            href="/#seguridad"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Seguridad
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Perfil
          </Link>
        </div>
      </nav>
    </header>
  );
}
