import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/db/models/Inquiry";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/inquiries
 * 
 * Fetch all inquiries with optional filters and pagination.
 * Requires authentication (admin/editor).
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 * - source: "contact_form" | "product_inquiry" | "whatsapp"
 * - status: "new" | "contacted" | "converted" | "closed"
 * - sort: string (default: "-createdAt")
 * 
 * @returns { success: boolean, inquiries: array, pagination: object }
 */
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query: any = {};

    if (source) {
      query.source = source;
    }

    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch inquiries
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate("product", "name slug images")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        inquiries,
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
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inquiries
 * 
 * Create a new inquiry.
 * Public endpoint (for contact forms).
 * 
 * @body { fullName, email?, phone, message, product?, source? }
 * @returns { success: boolean, inquiry: object }
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validation
    if (!body.fullName || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, message: "Full name, phone, and message are required" },
        { status: 400 }
      );
    }

    // Email validation (if provided)
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, message: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    // Set default source if not provided
    if (!body.source) {
      body.source = "contact_form";
    }

    // Create inquiry
    const inquiry = await Inquiry.create(body);

    // TODO: Send email notification to admin (implement later)

    return NextResponse.json(
      {
        success: true,
        inquiry: {
          id: inquiry._id,
          source: inquiry.source,
          createdAt: inquiry.createdAt,
        },
        message: "Your inquiry has been submitted successfully. We'll get back to you soon!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/inquiries error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
