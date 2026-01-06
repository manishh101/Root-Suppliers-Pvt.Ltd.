import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

/**
 * Switch Component
 * 
 * Toggle switch for boolean options.
 * 
 * @example
 * ```tsx
 * <Switch
 *   label="Enable notifications"
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 * />
 * ```
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, helperText, className, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("flex flex-col", className)}>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={switchId}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors",
              "bg-gray-300 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500",
              "peer-checked:bg-primary-600",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                "peer-checked:translate-x-6 translate-x-1"
              )}
            />
          </label>
          {label && (
            <label
              htmlFor={switchId}
              className="ml-3 text-sm text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {helperText && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";
