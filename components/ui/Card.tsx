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
      className={`border-2 border-[var(--black)] bg-[var(--white)] p-6 rounded-none shadow-[4px_4px_0_0_var(--black)] ${className}`}
    >
      {children}
    </Component>
  );
}
