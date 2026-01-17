import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/db/models/Inquiry";
import Product from "@/lib/db/models/Product";
import { verifyAdmin } from "@/lib/auth";
import { inquirySchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";
import { withValidate } from "@/lib/api-middleware";
import { inquiryLimiter } from "@/lib/rate-limit";

// Ensure models are registered to prevent MissingSchemaError during population
const _models = { Product };

/**
 * GET /api/inquiries
 * 
 * Fetch all inquiries with optional filters and pagination.
 * Requires authentication (admin only).
 */
export async function GET(req: NextRequest) {
  try {
    await verifyAdmin(req);

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "-createdAt";

    const query: any = {};
    if (source) query.source = source;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

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

    return successResponse({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/inquiries
 * 
 * Create a new inquiry.
 * Public endpoint with rate limiting (3 requests / 15 mins).
 */
export const POST = withValidate(
  async (req: NextRequest, validatedData: any) => {
    await connectDB();

    // Sanitize message
    if (validatedData.message) {
      validatedData.message = sanitizeHtml(validatedData.message);
    }

    // Create inquiry
    const inquiry = await Inquiry.create(validatedData);

    return successResponse(
      {
        inquiry: {
          id: inquiry._id,
          source: inquiry.source,
          createdAt: inquiry.createdAt,
        },
      },
      201,
      "Your inquiry has been submitted successfully. We'll get back to you soon!"
    );
  },
  {
    schema: inquirySchema,
    limiter: inquiryLimiter,
  }
);

