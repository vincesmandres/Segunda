import { type ReactNode, type LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  htmlFor?: string;
}

export function Label({ children, htmlFor, className = "", ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-[var(--black)] mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
