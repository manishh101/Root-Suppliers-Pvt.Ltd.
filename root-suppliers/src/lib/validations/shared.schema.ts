import { z } from "zod";

/**
 * Shared image schema
 */
export const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().min(1, "Public ID is required"),
  alt: z.string().optional(),
});

/**
 * Shared SEO/Meta schema
 */
export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

/**
 * Shared status and ordering schema
 */
export const baseStatusSchema = z.object({
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});
