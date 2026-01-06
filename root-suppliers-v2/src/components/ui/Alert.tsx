import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

/**
 * Alert Component
 * 
 * Inline notification component for displaying contextual feedback messages.
 * Supports different variants with corresponding colors and icons.
 * 
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!">
 *   Your product has been created successfully.
 * </Alert>
 * 
 * <Alert variant="error" title="Error" onClose={() => console.log('closed')}>
 *   Failed to create product. Please try again.
 * </Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  onClose,
  showIcon = true,
  children,
  className,
  ...props
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border",
        styles[variant],
        className
      )}
      {...props}
    >
      {showIcon && (
        <div className={cn("flex-shrink-0 mt-0.5", iconColors[variant])}>
          {icons[variant]}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="font-semibold text-sm mb-1">{title}</h5>
        )}
        <div className="text-sm">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
