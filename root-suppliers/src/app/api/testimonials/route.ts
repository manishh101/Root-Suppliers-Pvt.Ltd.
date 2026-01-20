import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/errors";

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

    return successResponse({
      testimonials,
      total: testimonials.length,
    });
  } catch (error) {
    return handleApiError(error);
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
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Create testimonial
    const testimonial = await Testimonial.create(body);

    return successResponse({ testimonial }, 201, "Testimonial created successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}

