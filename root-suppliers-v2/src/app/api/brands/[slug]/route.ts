import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth } from "@/lib/auth";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/brands/[slug]
 * 
 * Fetch a single brand by slug.
 * Public endpoint.
 * 
 * @returns { success: boolean, brand: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const brand = await Brand.findOne({ slug: params.slug }).lean();

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        brand,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/brands/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/brands/[slug]
 * 
 * Update a brand.
 * Requires authentication (admin only).
 * 
 * @body Partial<Brand>
 * @returns { success: boolean, brand: object }
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

    const brand = await Brand.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        brand,
        message: "Brand updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/brands/${params.slug} error:`, error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Brand with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update brand" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/brands/[slug]
 * 
 * Delete a brand.
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

    const brand = await Brand.findOneAndDelete({ slug: params.slug });

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Brand deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/brands/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
