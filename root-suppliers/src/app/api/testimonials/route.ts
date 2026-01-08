import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/testimonials
 * 
 * Fetch all testimonials.
 * Public endpoint (only returns active testimonials for non-authenticated users).
 * 
 * Query params:
 * - isActive: boolean (filter by active status - admin only)
 * - isFeatured: boolean (filter by featured status)
 * - limit: number (default: 10)
 * 
 * @returns { success: boolean, testimonials: array }
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = {};

    // Non-authenticated users can only see active testimonials
    if (!user) {
      query.isActive = true;
    } else if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    // Fetch testimonials
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        testimonials,
        total: testimonials.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * 
 * Create a new testimonial.
 * Requires authentication (admin only).
 * 
 * @body { customerName, customerDesignation?, reviewText, rating, customerImage?, isActive?, isFeatured? }
 * @returns { success: boolean, testimonial: object }
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
    if (!body.customerName || !body.reviewText || !body.rating) {
      return NextResponse.json(
        { success: false, message: "Customer name, review text, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create testimonial
    const testimonial = await Testimonial.create(body);

    return NextResponse.json(
      {
        success: true,
        testimonial,
        message: "Testimonial created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
