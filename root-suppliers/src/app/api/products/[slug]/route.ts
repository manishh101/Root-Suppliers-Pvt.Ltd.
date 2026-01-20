import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { handleApiError, successResponse, AuthError, NotFoundError } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";

// Ensure models are registered to prevent MissingSchemaError during population
const _models = { Category, Brand };

interface RouteParams {
  params: {
    slug: string;
  };
}

// Force this route to be dynamic and not cached
export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[slug]
 * 
 * Fetch a single product by slug.
 * Public endpoint.
 * 
 * @returns { success: boolean, product: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug })
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .lean();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // console.log(`[GET] Product ${params.slug} stock:`, product.stock);

    return successResponse({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/products/[slug]
 * 
 * Update a product by slug.
 * Requires authentication (admin only).
 * 
 * @body Partial<Product>
 * @returns { success: boolean, product: object }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();
    const body = await req.json();

    // console.log(`[PUT] Update request for ${params.slug}. Stock in payload:`, body.stock);

    const validatedData = productSchema.partial().parse(body);

    // Transform and normalize data for Mongoose
    const updateData: any = { ...validatedData };

    // 1. Transform meta fields
    if (validatedData.metaTitle !== undefined || validatedData.metaDescription !== undefined) {
      updateData.meta = {
        title: validatedData.metaTitle || "",
        description: validatedData.metaDescription || "",
      };
      delete updateData.metaTitle;
      delete updateData.metaDescription;
    }

    // 2. Map order to orderIndex
    if (validatedData.order !== undefined) {
      updateData.orderIndex = validatedData.order;
      delete updateData.order;
    }

    // 3. Normalize brand field (empty string to null to prevent CastError)
    if (updateData.brand === "") {
      updateData.brand = null;
    }

    // Sanitize rich text fields
    if (updateData.description) {
      updateData.description = sanitizeHtml(updateData.description);
    }
    if (updateData.shortDescription) {
      updateData.shortDescription = sanitizeHtml(updateData.shortDescription);
    }

    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return successResponse({ product }, 200, "Product updated successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/products/[slug]
 * 
 * Delete a product by slug.
 * Requires authentication (admin only).
 * 
 * @returns { success: boolean, message: string }
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();

    const product = await Product.findOneAndDelete({ slug: params.slug });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return successResponse({}, 200, "Product deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
