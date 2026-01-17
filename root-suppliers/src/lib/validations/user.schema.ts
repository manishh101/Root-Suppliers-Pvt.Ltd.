import { z } from "zod";

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).strict();

/**
 * User registration/management schema
 */
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "editor"]).default("editor"),
  isActive: z.boolean().default(true),
}).strict();
