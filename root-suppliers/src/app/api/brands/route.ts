import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { brandSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";

// ... GET function ...

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
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await verifyAuth(req);
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

    return NextResponse.json(
      {
        success: true,
        brands,
        total: brands.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/brands
 * 
 * Create a new brand.
 * Requires authentication (admin only).
 * 
 * @body { name, logo, website?, description?, order?, isActive?, isFeatured? }
 * @returns { success: boolean, brand: object }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Validation using Zod
    const validatedData = brandSchema.parse(body);

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
  } catch (error: any) {
    return handleApiError(error);
  }
}
