import { type ReactNode } from "react";

interface SlideSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SlideSection({ title, children, className = "" }: SlideSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-lg font-[var(--font-pixel)] text-[var(--black)] mb-4 border-b-2 border-[var(--black)] pb-2">
        {title}
      </h2>
      <div className="prose prose-neutral max-w-none text-[var(--black)]/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
