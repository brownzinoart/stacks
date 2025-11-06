import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * v2.0 Brutalist Input Component
 * - Light borders (2px) for subtlety
 * - Cyan offset shadow on focus
 * - Error state support
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, label, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-3 font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-brutal ${error ? "border-accent-coral" : ""} ${className}`}
          {...props}
        />
        {helperText && (
          <p
            className={`mt-2 text-sm font-semibold ${
              error
                ? "text-accent-coral"
                : "text-light-textTertiary dark:text-dark-textTertiary"
            }`}
          >
            {error && "❌ "}
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
