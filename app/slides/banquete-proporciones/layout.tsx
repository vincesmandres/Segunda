import type { Metadata } from "next";
import { Suspense } from "react";
import { SlideNav } from "@/components/slides/SlideNav";

export const metadata: Metadata = {
  title: "El Banquete de las Proporciones — Slides",
  description:
    "Informe técnico de innovación: estrategias y recursos didácticos inclusivos en matemática (Polypad + Wayground). EGB Media/Superior.",
};

function SlideNavFallback() {
  return (
    <nav
      className="border-b-2 border-[var(--black)] bg-[var(--white)] px-4 py-3 flex items-center gap-2"
      aria-label="Navegación de la presentación"
    >
      <a href="/slides/banquete-proporciones" className="text-xs font-[var(--font-pixel)] text-[var(--black)] hover:underline">
        Índice
      </a>
    </nav>
  );
}

export default function BanqueteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <Suspense fallback={<SlideNavFallback />}>
        <SlideNav />
      </Suspense>
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}
