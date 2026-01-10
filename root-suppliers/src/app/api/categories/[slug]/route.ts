import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Category from "@/lib/db/models/Category";
import Product from "@/lib/db/models/Product";
import { verifyAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { handleApiError, successResponse, NotFoundError, ValidationError } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug: params.slug }).lean();
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    const productCount = await Product.countDocuments({ category: category._id, isActive: true });
    return successResponse({ category: { ...category, productCount } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await verifyAdmin(req);

    await connectDB();
    const body = await req.json();

    // Partial validation
    const validatedData = categorySchema.partial().parse(body);

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

    // 3. Normalize parent field (empty string to null to prevent CastError)
    if (updateData.parent === "") {
      updateData.parent = null;
    }

    // Sanitize rich text
    if (updateData.description) {
      updateData.description = sanitizeHtml(updateData.description);
    }

    const category = await Category.findOneAndUpdate(
      { slug: params.slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return successResponse({ category }, 200, "Category updated successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await verifyAdmin(req);

    await connectDB();
    const category = await Category.findOne({ slug: params.slug });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      throw new ValidationError(`Cannot delete category. It has ${productCount} products.`);
    }

    const childrenCount = await Category.countDocuments({ parent: category._id });
    if (childrenCount > 0) {
      throw new ValidationError(`Cannot delete category. It has ${childrenCount} subcategories.`);
    }

    await Category.findByIdAndDelete(category._id);
    return successResponse({}, 200, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
