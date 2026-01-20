import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Brand from "@/lib/db/models/Brand";
import { verifyAdmin } from "@/lib/auth";
import { brandSchema } from "@/lib/validations";
import { handleApiError, successResponse, NotFoundError } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/brands/[slug]
 * 
 * Fetch a single brand by slug.
 * Public endpoint.
 * 
 * @returns { success: boolean, brand: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const brand = await Brand.findOne({ slug: params.slug }).lean();

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    return successResponse({ brand });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/brands/[slug]
 * 
 * Update a brand.
 * Requires authentication (admin only).
 * 
 * @body Partial<Brand>
 * @returns { success: boolean, brand: object }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();
    const body = await req.json();

    const validatedData = brandSchema.partial().parse(body);

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

    // Sanitize rich text
    if (updateData.description) {
      updateData.description = sanitizeHtml(updateData.description);
    }

    const brand = await Brand.findOneAndUpdate(
      { slug: params.slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    return successResponse({ brand }, 200, "Brand updated successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/brands/[slug]
 * 
 * Delete a brand.
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

    const brand = await Brand.findOneAndDelete({ slug: params.slug });

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    return successResponse({}, 200, "Brand deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
