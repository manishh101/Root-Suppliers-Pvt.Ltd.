import { z } from "zod";

/**
 * Inquiry validation schema.
 */
export const inquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  product: z.string().optional(),
  source: z.enum(["contact_form", "product_inquiry", "whatsapp"]).default("contact_form"),
}).strict();

export type InquiryFormData = z.infer<typeof inquirySchema>;
