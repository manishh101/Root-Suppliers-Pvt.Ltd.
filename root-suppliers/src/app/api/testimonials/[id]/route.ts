import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse, NotFoundError } from "@/lib/errors";

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
      throw new NotFoundError("Testimonial not found");
    }

    return successResponse({ testimonial });
  } catch (error) {
    return handleApiError(error);
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
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Don't allow changing _id or createdAt
    delete body._id;
    delete body.createdAt;

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    // Revalidate pages that display testimonials
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidateTag("testimonials");

    return successResponse({ testimonial }, 200, "Testimonial updated successfully");
  } catch (error) {
    return handleApiError(error);
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
    await verifyAdmin(req);

    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    // Revalidate pages that display testimonials
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidateTag("testimonials");

    return successResponse({}, 200, "Testimonial deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

