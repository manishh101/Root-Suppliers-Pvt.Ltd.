import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth } from "@/lib/auth";

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
    console.error("GET /api/brands error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
      { status: 500 }
    );
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
    if (!body.name || !body.logo) {
      return NextResponse.json(
        { success: false, message: "Name and logo are required" },
        { status: 400 }
      );
    }

    // Validate logo fields
    if (!body.logo.url || !body.logo.publicId) {
      return NextResponse.json(
        { success: false, message: "Logo must have url and publicId" },
        { status: 400 }
      );
    }

    // Create brand
    const brand = await Brand.create(body);

    return NextResponse.json(
      {
        success: true,
        brand,
        message: "Brand created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/brands error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Brand with this slug already exists" },
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
      { success: false, message: "Failed to create brand" },
      { status: 500 }
    );
  }
}
