import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth } from "@/lib/auth";

// Ensure models are registered to prevent MissingSchemaError during population
const _models = { Category, Brand };

interface RouteParams {
  params: {
    slug: string;
  };
}

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
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/products/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
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
    // Verify authentication
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    // Don't allow changing _id or createdAt
    delete body._id;
    delete body.createdAt;

    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/products/${params.slug} error:`, error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
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
    // Verify authentication
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const product = await Product.findOneAndDelete({ slug: params.slug });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/products/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
