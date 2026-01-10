import { z } from "zod";

/**
 * Product validation schema used for both frontend forms and backend API requests.
 */
import { imageSchema, seoSchema, baseStatusSchema } from "./shared.schema";

/**
 * Product validation schema used for both frontend forms and backend API requests.
 */
export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(1, "Short description is required"),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  unit: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  discountPrice: z.number().optional(),
  images: z.array(imageSchema).min(1, "At least one image is required"),
  specifications: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ).default([]),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isTopSelling: z.boolean().default(false),
}).merge(baseStatusSchema).merge(seoSchema).strict();

export type ProductFormData = z.infer<typeof productSchema>;
