import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success" | "outline";
  size?: "default" | "touch";
  fullWidth?: boolean;
}

/**
 * v2.0 Brutalist Button Component
 * - Heavy borders (5px) for CTAs
 * - Offset shadow animations
 * - Touch-friendly sizes on mobile
 */
export default function Button({
  children,
  variant = "primary",
  size = "default",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = size === "touch" ? "btn-brutal-touch" : "btn-brutal";

  const variantClasses = {
    primary: "bg-accent-cyan text-white",
    secondary: "bg-accent-yellow text-light-text dark:text-dark-text",
    accent: "bg-accent-coral text-white",
    success: "bg-accent-teal text-light-text dark:text-dark-text",
    outline: "bg-transparent text-light-text dark:text-dark-text",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
