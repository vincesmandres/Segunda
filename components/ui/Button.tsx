import { type ReactNode, type ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  href?: never;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white border border-[var(--primary)] hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)] shadow-sm",
  secondary:
    "bg-transparent text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)]/5",
  ghost:
    "text-[var(--muted)] border-transparent hover:text-[var(--foreground)] hover:bg-[var(--border)]/50",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:ring-offset-2 disabled:opacity-50";
  const styles = `${base} ${variantStyles[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={styles} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
