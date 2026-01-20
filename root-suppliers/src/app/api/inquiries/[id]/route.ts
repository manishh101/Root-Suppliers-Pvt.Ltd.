import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/db/models/Inquiry";
import Product from "@/lib/db/models/Product";
import { verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse, NotFoundError } from "@/lib/errors";

// Ensure models are registered to prevent MissingSchemaError during population
const _models = { Product };

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/inquiries/[id]
 * 
 * Fetch a single inquiry by ID.
 * Requires authentication (admin only).
 * 
 * @returns { success: boolean, inquiry: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();

    const inquiry = await Inquiry.findById(params.id)
      .populate("product", "name slug images")
      .lean();

    if (!inquiry) {
      throw new NotFoundError("Inquiry not found");
    }

    return successResponse({ inquiry });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/inquiries/[id]
 * 
 * Update an inquiry (typically status and notes).
 * Requires authentication (admin only).
 * 
 * @body { status?, notes? }
 * @returns { success: boolean, inquiry: object }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Only allow updating status and notes
    const allowedFields = { status: body.status, notes: body.notes };

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      { $set: allowedFields },
      { new: true, runValidators: true }
    ).populate("product", "name slug images");

    if (!inquiry) {
      throw new NotFoundError("Inquiry not found");
    }

    return successResponse({ inquiry }, 200, "Inquiry updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/inquiries/[id]
 * 
 * Delete an inquiry.
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

    const inquiry = await Inquiry.findByIdAndDelete(params.id);

    if (!inquiry) {
      throw new NotFoundError("Inquiry not found");
    }

    return successResponse({}, 200, "Inquiry deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

