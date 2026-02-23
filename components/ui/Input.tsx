import { type InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-4 py-3
          bg-[var(--white)] text-[var(--black)]
          border-2 border-[var(--black)] rounded-none
          focus:outline-none focus:ring-2 focus:ring-[var(--black)] focus:ring-offset-2
          placeholder:text-neutral-400
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
