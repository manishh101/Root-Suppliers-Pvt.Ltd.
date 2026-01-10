import { z } from "zod";
import { imageSchema, seoSchema, baseStatusSchema } from "./shared.schema";

/**
 * Blog validation schema.
 */
export const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: imageSchema.optional().nullable(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
}).merge(baseStatusSchema).merge(seoSchema).strict();

export type BlogFormData = z.infer<typeof blogSchema>;
