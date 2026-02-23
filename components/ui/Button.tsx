import { type ReactNode, type ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

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
    "bg-[var(--black)] text-[var(--white)] border-2 border-[var(--black)] hover:bg-[var(--black)] hover:text-[var(--white)] shadow-[4px_4px_0_0_var(--black)] active:shadow-[1px_1px_0_0_var(--black)] active:translate-x-[3px] active:translate-y-[3px]",
  secondary:
    "bg-[var(--white)] text-[var(--black)] border-2 border-[var(--black)] hover:bg-[var(--beige)] shadow-[4px_4px_0_0_var(--black)] active:shadow-[1px_1px_0_0_var(--black)] active:translate-x-[3px] active:translate-y-[3px]",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-75 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--black)] focus:ring-offset-2 disabled:opacity-50 font-[var(--font-pixel)] tracking-wide select-none";
  const styles = `${base} rounded-none ${variantStyles[variant]} ${className}`;

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
