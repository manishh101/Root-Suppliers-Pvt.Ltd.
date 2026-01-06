import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/products
 * 
 * Fetch all products with optional filters and pagination.
 * Public endpoint.
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 12)
 * - category: string (category slug)
 * - search: string (search in name and description)
 * - isActive: boolean (filter by active status)
 * - sort: string (sortBy field, e.g., "createdAt" or "-createdAt" for desc)
 * 
 * @returns { success: boolean, products: array, pagination: object }
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * 
 * Create a new product.
 * Requires authentication (admin only).
 * 
 * @body { name, description, shortDescription?, category, images, specifications?, isActive? }
 * @returns { success: boolean, product: object }
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
    if (!body.name || !body.description || !body.shortDescription || !body.category) {
      return NextResponse.json(
        { success: false, message: "Name, description, short description, and category are required" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create(body);

    // Populate category
    await product.populate("category", "name slug");

    return NextResponse.json(
      {
        success: true,
        product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      // Mongoose validation error
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: messages[0] || "Validation Error" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
