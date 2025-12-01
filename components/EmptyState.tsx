"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "primary" | "secondary" | "accent" | "info";
  size?: "small" | "medium" | "large";
  customIcon?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "primary",
  size = "medium",
  customIcon,
}: EmptyStateProps) {
  const variantClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    accent: "bg-gradient-accent",
    info: "bg-gradient-info",
  };

  const sizeClasses = {
    small: {
      container: "p-6",
      icon: "w-12 h-12 mb-3",
      title: "text-lg",
      description: "text-sm",
    },
    medium: {
      container: "p-8",
      icon: "w-16 h-16 mb-4",
      title: "text-2xl",
      description: "text-base",
    },
    large: {
      container: "p-12",
      icon: "w-24 h-24 mb-6",
      title: "text-3xl",
      description: "text-lg",
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={`${variantClasses[variant]} border-[5px] border-light-border dark:border-dark-border shadow-brutal rounded-[20px] ${sizeConfig.container} text-center`}
    >
      {/* Icon */}
      {customIcon ? (
        <div className={`mx-auto ${sizeConfig.icon}`}>{customIcon}</div>
      ) : Icon ? (
        <Icon
          className={`${sizeConfig.icon} mx-auto stroke-[3] text-white`}
        />
      ) : null}

      {/* Title */}
      <h3 className={`font-display font-black uppercase tracking-tight text-white ${sizeConfig.title} mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`text-white font-semibold ${sizeConfig.description} mb-6 opacity-90`}>
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-brutal bg-white text-light-text dark:text-dark-text hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
