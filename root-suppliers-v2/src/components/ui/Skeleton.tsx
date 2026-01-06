import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer effect.
 * Used while content is being fetched.
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" width="200px" height="20px" />
 * <Skeleton variant="circular" width="48px" height="48px" />
 * <Skeleton variant="rectangular" height="200px" />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className,
  style,
  ...props
}) => {
  const baseStyles = "bg-gray-200 animate-pulse";

  const variants = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const combinedStyle = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "text" ? "1rem" : "100px"),
    ...style,
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={combinedStyle}
      {...props}
    />
  );
};

/**
 * Product Card Skeleton
 * Pre-built skeleton for product cards
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <Skeleton variant="rectangular" height="200px" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton variant="text" width="80px" />
          <Skeleton variant="rectangular" width="100px" height="36px" />
        </div>
      </div>
    </div>
  );
};

/**
 * Blog Card Skeleton
 * Pre-built skeleton for blog cards
 */
export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <Skeleton variant="rectangular" height="240px" />
      <div className="p-6 space-y-3">
        <Skeleton variant="text" width="40%" height="12px" />
        <Skeleton variant="text" width="90%" height="24px" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex items-center gap-3 mt-4">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="120px" height="12px" />
            <Skeleton variant="text" width="80px" height="10px" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Table Row Skeleton
 * Pre-built skeleton for table rows
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton variant="text" />
        </td>
      ))}
    </tr>
  );
};
