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
  slug: z.string().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  unit: z.string().optional(),
  price: z.number().optional(),
  discountPrice: z.number().optional(),
  stock: z.number().optional().default(0),
  images: z.array(imageSchema).default([]),
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
