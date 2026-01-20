import { z } from "zod";

/**
 * Brand validation schema.
 */
import { imageSchema, seoSchema, baseStatusSchema } from "./shared.schema";

/**
 * Brand validation schema.
 */
export const brandSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  logo: imageSchema.optional().nullable(),
  website: z.string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      { message: "Invalid URL format" }
    ),
}).merge(baseStatusSchema).merge(seoSchema);

export type BrandFormData = z.infer<typeof brandSchema>;
