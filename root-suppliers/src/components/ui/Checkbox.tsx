import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Checkbox Component
 * 
 * Custom styled checkbox input with label support.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to the terms and conditions"
 *   checked={agreed}
 *   onChange={(e) => setAgreed(e.target.checked)}
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("flex flex-col", className)}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="sr-only peer"
              {...props}
            />
            <label
              htmlFor={checkboxId}
              className={cn(
                "flex items-center justify-center h-5 w-5 border-2 rounded cursor-pointer transition-all",
                "peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500",
                "peer-checked:bg-primary-600 peer-checked:border-primary-600",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error
                  ? "border-red-500"
                  : "border-gray-300 hover:border-primary-600"
              )}
            >
              <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </label>
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-3 text-sm text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
