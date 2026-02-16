import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-[var(--background)] text-[var(--muted)] border-[var(--border)]",
  primary:
    "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
  success:
    "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  warning:
    "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  danger:
    "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
