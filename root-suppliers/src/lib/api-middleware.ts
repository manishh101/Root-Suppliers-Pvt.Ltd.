import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { handleApiError, AppError } from "@/lib/errors";
import { RateLimiter, publicApiLimiter } from "@/lib/rate-limit";

import { verifyAuth, verifyAdmin } from "@/lib/auth";

interface MiddlewareOptions {
  schema?: ZodSchema;
  limiter?: RateLimiter;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * A higher-order function to wrap API handlers with validation, 
 * rate limiting, and standard error handling.
 */
export function withValidate(
  handler: (req: NextRequest, validatedData: any) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // 1. Auth Check (if required)
      if (options.requireAdmin) {
        await verifyAdmin(req);
      } else if (options.requireAuth) {
        await verifyAuth(req);
      }

      // 2. Rate Limiting
      const ip = req.headers.get("x-forwarded-for") || "anonymous";
      const limiter = options.limiter || publicApiLimiter;

      if (!limiter.check(ip)) {
        throw new AppError("Too many requests. Please try again later.", 429);
      }

      // 2. Body Validation (if schema provided)
      let validatedData = null;
      if (options.schema) {
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
          const body = await req.json();
          validatedData = options.schema.parse(body);
        } else {
          // For GET requests, we could validate searchParams if needed, 
          // but usually schema is for body.
          const { searchParams } = new URL(req.url);
          const params = Object.fromEntries(searchParams.entries());
          validatedData = options.schema.parse(params);
        }
      }

      // 3. Call actual handler
      const response = await handler(req, validatedData);

      // 4. Add Rate Limit Headers
      response.headers.set("X-RateLimit-Limit", String(limiter.limit));
      response.headers.set("X-RateLimit-Remaining", String(limiter.getRemaining(ip)));

      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };
}
