import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Category from "@/lib/db/models/Category";
import Product from "@/lib/db/models/Product";
import { verifyAuth } from "@/lib/auth";

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
export async function GET(req: NextRequest) {
  try {
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
    const categories = await Category.find(query).sort({ order: 1, name: 1 }).lean();

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

      return NextResponse.json(
        {
          success: true,
          categories: categoriesWithCounts,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * 
 * Create a new category.
 * Requires authentication (admin only).
 * 
 * @body { name, description?, image?, order?, isActive? }
 * @returns { success: boolean, category: object }
 */
export async function POST(req: NextRequest) {
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

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Create category
    const category = await Category.create(body);

    return NextResponse.json(
      {
        success: true,
        category,
        message: "Category created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/categories error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
