import { z } from "zod";

/**
 * Category validation schema.
 */
import { imageSchema, seoSchema, baseStatusSchema } from "./shared.schema";

/**
 * Category validation schema.
 */
export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().optional(),
  parent: z.string().optional().nullable(),
  image: imageSchema.optional().nullable(),
}).merge(baseStatusSchema).merge(seoSchema).strict();

export type CategoryFormData = z.infer<typeof categorySchema>;
