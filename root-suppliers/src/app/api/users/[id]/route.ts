import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/users/[id]
 * 
 * Fetch a single user by ID.
 * Requires authentication (admin or self).
 * 
 * @returns { success: boolean, user: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify authentication
    const currentUser = await verifyAuth(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Allow admin or self to view
    if (currentUser.role !== "admin" && currentUser.userId !== params.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(params.id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/users/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * 
 * Update a user.
 * Requires authentication (admin or self).
 * Note: Only admin can change role or isActive status.
 * 
 * @body Partial<User>
 * @returns { success: boolean, user: object }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify authentication
    const currentUser = await verifyAuth(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Allow admin or self to update
    if (currentUser.role !== "admin" && currentUser.userId !== params.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    // Don't allow changing _id or createdAt
    delete body._id;
    delete body.createdAt;

    // Only admin can change role or isActive
    if (currentUser.role !== "admin") {
      delete body.role;
      delete body.isActive;
    }

    // If password is being updated, hash it
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      const salt = await bcrypt.genSalt(12);
      body.password = await bcrypt.hash(body.password, salt);
    }

    // Normalize email if present
    if (body.email) {
      body.email = body.email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/users/${params.id} error:`, error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * 
 * Delete a user.
 * Requires authentication (admin only).
 * Admin cannot delete themselves.
 * 
 * @returns { success: boolean, message: string }
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verify authentication
    const currentUser = await verifyAuth(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    if (currentUser.userId === params.id) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/users/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
