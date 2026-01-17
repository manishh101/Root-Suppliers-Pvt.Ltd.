import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Category from "@/lib/db/models/Category";
import Product from "@/lib/db/models/Product";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { handleApiError, successResponse, AuthError, ForbiddenError } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";
import { withValidate } from "@/lib/api-middleware";
import { publicApiLimiter } from "@/lib/rate-limit";

// ... existing GET ...

/**
 * GET /api/categories
 * 
 * Fetch all categories with optional product counts.
 * Public endpoint.
 * 
 * Query params:
 * - includeProductCount: boolean (default: false)
 * - isActive: boolean (filter by active status)
 * 
 * @returns { success: boolean, categories: array }
 */
export const GET = withValidate(
  async (req: NextRequest) => {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeProductCount = searchParams.get("includeProductCount") === "true";
    const isActive = searchParams.get("isActive");

    // Build query
    const query: any = {};

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Fetch categories
    const categories = await Category.find(query).sort({ orderIndex: 1, name: 1 }).lean();

    // Add product counts if requested
    if (includeProductCount) {
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.countDocuments({
            category: category._id,
            isActive: true,
          });
          return { ...category, productCount };
        })
      );

      return successResponse({ categories: categoriesWithCounts });
    }

    return successResponse({ categories });
  },
  { limiter: publicApiLimiter }
);

/**
 * POST /api/categories
 * 
 * Create a new category.
 * Requires authentication (admin only).
 * 
 * @body { name, description?, image?, order?, isActive? }
 * @returns { success: boolean, category: object }
 */
export const POST = withValidate(
  async (req: NextRequest, validatedData: any) => {
    await connectDB();

    // Transform and normalize data for Mongoose
    const categoryData: any = { ...validatedData };

    // 1. Transform meta fields
    if (validatedData.metaTitle !== undefined || validatedData.metaDescription !== undefined) {
      categoryData.meta = {
        title: validatedData.metaTitle || "",
        description: validatedData.metaDescription || "",
      };
      delete categoryData.metaTitle;
      delete categoryData.metaDescription;
    }

    // 2. Map order to orderIndex
    if (validatedData.order !== undefined) {
      categoryData.orderIndex = validatedData.order;
      delete categoryData.order;
    }

    // 3. Normalize parent field (empty string to null to prevent CastError)
    if (categoryData.parent === "") {
      categoryData.parent = null;
    }

    // Sanitize rich text
    if (categoryData.description) {
      categoryData.description = sanitizeHtml(categoryData.description);
    }

    // Create category
    const category = await Category.create(categoryData);

    return successResponse({ category }, 201, "Category created successfully");
  },
  {
    schema: categorySchema,
    requireAdmin: true,
  }
);
