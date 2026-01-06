import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { verifyAuth } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/testimonials/[id]
 * 
 * Fetch a single testimonial by ID.
 * Admin can see all, public can only see active testimonials.
 * 
 * @returns { success: boolean, testimonial: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const user = await verifyAuth(req);
    const query: any = { _id: params.id };

    // Non-authenticated users can only see active testimonials
    if (!user) {
      query.isActive = true;
    }

    const testimonial = await Testimonial.findOne(query).lean();

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        testimonial,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/testimonials/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/testimonials/[id]
 * 
 * Update a testimonial.
 * Requires authentication (admin only).
 * 
 * @body Partial<Testimonial>
 * @returns { success: boolean, testimonial: object }
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

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        testimonial,
        message: "Testimonial updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /api/testimonials/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]
 * 
 * Delete a testimonial.
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

    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/testimonials/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
