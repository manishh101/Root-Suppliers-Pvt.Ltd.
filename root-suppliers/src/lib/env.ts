import { z } from "zod";

const envSchema = z.object({
  // Infrastructure
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().url(),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Media
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // Public (Client-side)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Root Suppliers"),

  // Optional but recommended
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Lazy validation to avoid build-time errors
let _cachedEnv: z.infer<typeof envSchema> | null = null;

function validateEnv() {
  if (_cachedEnv) return _cachedEnv;
  
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors
    );
    // Don't throw during build, only log warning
    console.warn("⚠️ Some environment variables are missing or invalid. API routes may fail.");
    return null;
  }
  
  _cachedEnv = result.data;
  return _cachedEnv;
}

// Export getter function instead of throwing at module load
export function getEnv() {
  return validateEnv();
}

// For backward compatibility, but may be null during build
export const env = validateEnv();

/**
 * Helper to ensure we don't accidentally expose secrets to the client
 * if we were to use this on the client side.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> { }
  }
}
