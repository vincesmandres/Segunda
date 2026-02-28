"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BANQUETE_SECTIONS, getPrevNext, type BanqueteSectionId } from "@/lib/slides/banquete-sections";

function getSectionIdFromPath(pathname: string): BanqueteSectionId | null {
  const match = pathname.match(/\/slides\/banquete-proporciones\/([^/]+)/);
  const segment = match?.[1] ?? null;
  if (!segment || segment === "banquete-proporciones") return null;
  const found = BANQUETE_SECTIONS.find((s) => s.id === segment);
  return found ? (segment as BanqueteSectionId) : null;
}

const navLinkClass =
  "block py-2 px-3 text-xs font-[var(--font-pixel)] border border-[var(--black)] bg-[var(--white)] text-[var(--black)] hover:bg-[var(--beige)] no-underline";

export function SlideNav() {
  const pathname = usePathname();
  const currentSectionId = getSectionIdFromPath(pathname ?? "");
  const { prev, next } = currentSectionId ? getPrevNext(currentSectionId) : { prev: null, next: null };

  return (
    <nav
      className="border-b-2 border-[var(--black)] bg-[var(--white)] px-4 py-3 flex flex-wrap items-center justify-between gap-4"
      aria-label="Navegación de la presentación"
    >
      <div className="flex items-center gap-2">
        <Link
          href="/slides/banquete-proporciones"
          className="text-xs font-[var(--font-pixel)] text-[var(--black)] hover:underline"
        >
          Índice
        </Link>
        <span className="text-[var(--black)]/50">|</span>
        <div className="flex gap-2">
          {prev ? (
            <Link href={prev.path} className={navLinkClass}>
              ← {prev.title.split(". ")[1] ?? prev.title}
            </Link>
          ) : (
            <span className="py-2 px-3 text-xs text-[var(--black)]/50">← Anterior</span>
          )}
          {next ? (
            <Link href={next.path} className={navLinkClass}>
              {next.title.split(". ")[1] ?? next.title} →
            </Link>
          ) : (
            <span className="py-2 px-3 text-xs text-[var(--black)]/50">Siguiente →</span>
          )}
        </div>
      </div>
      <ul className="flex flex-wrap gap-1 list-none m-0 p-0">
        {BANQUETE_SECTIONS.map((s, i) => (
          <li key={s.id}>
            <Link
              href={s.path}
              className={`inline-flex w-8 h-8 items-center justify-center text-xs font-[var(--font-pixel)] border-2 no-underline ${
                currentSectionId === s.id
                  ? "bg-[var(--black)] text-[var(--white)] border-[var(--black)]"
                  : "bg-[var(--white)] text-[var(--black)] border-[var(--black)] hover:bg-[var(--beige)]"
              }`}
              title={s.title}
              aria-current={currentSectionId === s.id ? "page" : undefined}
            >
              {i + 1}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
