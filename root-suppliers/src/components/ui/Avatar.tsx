import React from "react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

/**
 * Avatar Component
 * 
 * Displays a user profile picture with automatic fallback.
 * Shows initials or icon if no image is provided.
 * 
 * @example
 * ```tsx
 * <Avatar src="/avatars/user.jpg" alt="John Doe" size="md" />
 * <Avatar fallback="JD" size="lg" />
 * <Avatar size="sm" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  fallback,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-600 font-medium",
        sizes[size],
        className
      )}
    >
      {!showFallback ? (
        <CloudinaryImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        <span>{fallback}</span>
      ) : (
        <User className={iconSizes[size]} />
      )}
    </div>
  );
};

/**
 * Avatar Group Component
 * 
 * Displays multiple avatars in an overlapping stack.
 * 
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 *   <Avatar src="/user4.jpg" alt="User 4" />
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup: React.FC<{
  children: React.ReactNode;
  max?: number;
  className?: string;
}> = ({ children, max = 3, className }) => {
  const childArray = React.Children.toArray(children);
  const displayChildren = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-gray-700 text-sm font-medium ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};
