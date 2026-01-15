import { CldImageProps } from 'next-cloudinary';

// Placeholder images for when actual images are missing or loading
export const PLACEHOLDER_IMAGES = {
  PRODUCT: '/images/placeholder.jpg',
  USER: '/images/placeholder.jpg',
  BRAND: '/images/placeholder.jpg',
  HERO: '/images/placeholder.jpg',
  BLOG: '/images/placeholder.jpg',
  LOGO: '/images/logo.png',
};

// Standard transformations to ensure consistency
export const DEFAULT_TRANSFORMATIONS = {
  quality: 'auto',
  format: 'webp', // Switched to webp as requested
};

/**
 * Helper to determine if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  // If we have a cloud name configured, only treat URLs from THAT cloud as optimize-able
  if (cloudName) {
    return url.includes(`res.cloudinary.com/${cloudName}`);
  }
  // Fallback: if no cloud name configured, treat any cloudinary URL as optimize-able (might break for foreign clouds)
  return url.includes('res.cloudinary.com') || url.includes('cloudinary');
};

/**
 * Extract public ID from a Cloudinary URL
 * This is a basic implementation and might need refinement based on exact URL structure
 */
export const getPublicIdFromUrl = (url: string): string => {
  if (!url) return '';
  if (!isCloudinaryUrl(url)) return '';

  try {
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
    const parts = url.split('/upload/');
    if (parts.length < 2) return '';

    const afterUpload = parts[1];
    // Remove version if present (v1234567890/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remove extension
    const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));

    return publicId;
  } catch (e) {
    console.error('Error extracting public ID:', e);
    return '';
  }
};
