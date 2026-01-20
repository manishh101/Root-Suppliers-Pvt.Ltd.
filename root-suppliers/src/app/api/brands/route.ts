import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { brandSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";
import { withValidate } from "@/lib/api-middleware";
import { publicApiLimiter } from "@/lib/rate-limit";

// Force this route to be dynamic and not cached
export const dynamic = 'force-dynamic';

/**
 * GET /api/brands
 * 
 * Fetch all brands.
 * Public endpoint (only returns active brands for non-authenticated users).
 * 
 * Query params:
 * - isActive: boolean (filter by active status - admin only)
 * - isFeatured: boolean (filter by featured status)
 * 
 * @returns { success: boolean, brands: array }
 */
export const GET = withValidate(
  async (req: NextRequest) => {
    await connectDB();

    const user = await verifyAuth(req).catch(() => null);
    const { searchParams } = new URL(req.url);

    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");

    // Build query
    const query: any = {};

    // Non-authenticated users can only see active brands
    if (!user) {
      query.isActive = true;
    } else if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    // Fetch brands
    const brands = await Brand.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return successResponse({
      brands,
      total: brands.length,
    });
  },
  { limiter: publicApiLimiter }
);

/**
 * POST /api/brands
 * 
 * Create a new brand.
 * Requires authentication (admin only).
 * 
 * @body { name, logo, website?, description?, order?, isActive?, isFeatured? }
 * @returns { success: boolean, brand: object }
 */
export const POST = withValidate(
  async (req: NextRequest, validatedData: any) => {
    await connectDB();

    // Transform and normalize data for Mongoose
    const brandData: any = { ...validatedData };

    // 1. Transform meta fields
    if (validatedData.metaTitle !== undefined || validatedData.metaDescription !== undefined) {
      brandData.meta = {
        title: validatedData.metaTitle || "",
        description: validatedData.metaDescription || "",
      };
      delete brandData.metaTitle;
      delete brandData.metaDescription;
    }

    // Sanitize rich text
    if (brandData.description) {
      brandData.description = sanitizeHtml(brandData.description);
    }

    // Create brand
    const brand = await Brand.create(brandData);

    return successResponse({ brand }, 201, "Brand created successfully");
  },
  {
    schema: brandSchema,
    requireAdmin: true,
  }
);
