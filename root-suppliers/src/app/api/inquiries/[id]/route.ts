import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/db/models/Inquiry";
import Product from "@/lib/db/models/Product";
import { verifyAuth } from "@/lib/auth";

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
 * Requires authentication (admin/editor).
 * 
 * @returns { success: boolean, inquiry: object }
 */
export async function GET(
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

    await connectDB();

    const inquiry = await Inquiry.findById(params.id)
      .populate("product", "name slug images")
      .lean();

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        inquiry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/inquiries/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inquiries/[id]
 * 
 * Update an inquiry (typically status and notes).
 * Requires authentication (admin/editor).
 * 
 * @body { status?, notes? }
 * @returns { success: boolean, inquiry: object }
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
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        inquiry,
        message: "Inquiry updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /api/inquiries/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
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

    const inquiry = await Inquiry.findByIdAndDelete(params.id);

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/inquiries/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
