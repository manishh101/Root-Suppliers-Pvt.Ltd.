'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { CldImage, CldImageProps } from 'next-cloudinary';
import { isCloudinaryUrl, getPublicIdFromUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

/* 
 * Extend ImageProps but omit src since we handle it differently
 * and add Cloudinary specific props
 */
type BaseImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  publicId?: string;
  fallbackSrc?: string;
};

type CloudinaryImageProps = BaseImageProps & Omit<CldImageProps, 'src'>;

export function CloudinaryImage({
  src,
  publicId,
  alt,
  className,
  fallbackSrc = '/images/placeholder.jpg', // Only used if absolutely nothing else works
  width,
  height,
  fill,
  priority,
  sizes,
  style,
  onLoad,
  ...props
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine source to use
  // 1. Explicit publicId (optimised Cloudinary)
  // 2. src which is a valid Cloudinary URL -> extract publicId
  // 3. src which is a local/external URL -> use Next/Image
  // 4. Fallback

  const effectivePublicId = publicId || (src && isCloudinaryUrl(src) ? getPublicIdFromUrl(src) : null);
  const isCloudinary = !!effectivePublicId;

  // If we have neither publicId nor src, or if we errored, use fallback specific logic handled below
  // But actually, we might just want to show a placeholder div if no src is available

  const handleLoad = (e: any) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setError(true);
  };

  if (!src && !publicId) {
    return (
      <div
        className={cn("bg-gray-100 flex items-center justify-center text-gray-400", className)}
        style={fill ? { width: '100%', height: '100%', ...style } : { width, height, ...style }}
      >
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  if (error) {
    // If fallbackSrc is provided, try to render that (it might be a local asset)
    // If even that fails (or is what we just tried), render the placeholder div
    if (fallbackSrc && src !== fallbackSrc) {
      return (
        <div className={cn("relative overflow-hidden bg-gray-50", className)} style={style}>
          <Image
            src={fallbackSrc}
            alt={alt || "Fallback image"}
            className={cn("object-cover", className)}
            width={width ? Number(width) : undefined}
            height={height ? Number(height) : undefined}
            fill={fill}
            onError={() => setError(true)} // Prevent infinite loop if fallback also fails?
            {...props as any}
          />
        </div>
      )
    }

    return (
      <div
        className={cn("bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200", className)}
        style={fill ? { width: '100%', height: '100%', ...style } : { width, height, ...style }}
      >
        <span className="sr-only">Image failed to load</span>
        <ImageIcon className="w-1/3 h-1/3 opacity-30" />
      </div>
    );
  }

  // Case 1: Cloudinary Image
  if (isCloudinary && effectivePublicId) {
    return (
      <CldImage
        src={effectivePublicId}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        format="webp"
        quality="auto"
        {...props}
      />
    );
  }

  // Case 2: Standard Next/Image (Local or External non-Cloudinary)
  return (
    <Image
      src={src!}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      width={width ? Number(width) : undefined}
      height={height ? Number(height) : undefined}
      fill={fill}
      sizes={sizes}
      priority={priority}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      {...props as any}
    />
  );
}
