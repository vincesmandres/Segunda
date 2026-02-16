import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Card({
  children,
  className = "",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm ${className}`}
    >
      {children}
    </Component>
  );
}
