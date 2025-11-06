import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success";
  className?: string;
  onClick?: () => void;
}

/**
 * v2.0 Brutalist Badge Component
 * - Medium borders (3px) for balanced weight
 * - Hover animation for interactive badges
 * - Multiple color variants
 */
export default function Badge({
  children,
  variant = "primary",
  className = "",
  onClick,
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-accent-cyan text-white",
    secondary: "bg-accent-yellow text-light-text dark:text-dark-text",
    accent: "bg-accent-coral text-white",
    success: "bg-accent-teal text-light-text dark:text-dark-text",
  };

  const interactiveClass = onClick ? "cursor-pointer" : "";

  return (
    <span
      className={`badge-brutal ${variantClasses[variant]} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}
