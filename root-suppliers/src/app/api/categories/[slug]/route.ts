import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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

    // Revalidate all pages that display categories
    revalidatePath("/", "layout");
    revalidatePath("/categories");
    revalidatePath(`/categories/${category.slug}`);
    revalidatePath("/products"); // Products are listed by category
    revalidateTag("categories");

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

    // Iteratively find all subcategories to delete
    const categoryIdsToDelete = [category._id];
    let currentIds = [category._id];

    while (currentIds.length > 0) {
      const children = await Category.find({ parent: { $in: currentIds } }).select('_id');
      const childIds = children.map(c => c._id);
      if (childIds.length > 0) {
        categoryIdsToDelete.push(...childIds);
      }
      currentIds = childIds;
    }

    // Delete all products associated with these categories
    await Product.deleteMany({ category: { $in: categoryIdsToDelete } });

    // Delete all the collected categories
    await Category.deleteMany({ _id: { $in: categoryIdsToDelete } });

    // Revalidate all pages that display categories
    revalidatePath("/", "layout");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidateTag("categories");

    return successResponse({}, 200, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
