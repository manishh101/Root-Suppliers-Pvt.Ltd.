import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

const variantClasses = {
  primary: "border-primary-600 border-t-transparent",
  secondary: "border-secondary-600 border-t-transparent",
  white: "border-white border-t-transparent",
};

export function Spinner({ size = "md", variant = "primary", className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("inline-block animate-spin rounded-full", sizeClasses[size], variantClasses[variant], className)}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
