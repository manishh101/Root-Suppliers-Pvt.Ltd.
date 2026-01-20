import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse, NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import bcrypt from "bcryptjs";

// Force this route to be dynamic
export const dynamic = 'force-dynamic';
// Use Node.js runtime for database operations
export const runtime = 'nodejs';

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
    const currentUser = await verifyAuth(req);

    if (!currentUser) {
      throw new ForbiddenError("Unauthorized");
    }

    // Allow admin or self to view
    if (currentUser.role !== "admin" && currentUser.userId !== params.id) {
      throw new ForbiddenError("You do not have permission to view this user");
    }

    await connectDB();

    const user = await User.findById(params.id)
      .select("-password")
      .lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return successResponse({ user });
  } catch (error) {
    return handleApiError(error);
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
    const currentUser = await verifyAuth(req);

    if (!currentUser) {
      throw new ForbiddenError("Unauthorized");
    }

    // Allow admin or self to update
    if (currentUser.role !== "admin" && currentUser.userId !== params.id) {
      throw new ForbiddenError("You do not have permission to update this user");
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

    // If password is being updated, hash it (using same logic as before to be safe)
    if (body.password) {
      if (body.password.length < 8) {
        throw new ValidationError("Password must be at least 8 characters");
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
      throw new NotFoundError("User not found");
    }

    return successResponse({ user }, 200, "User updated successfully");
  } catch (error: any) {
    return handleApiError(error);
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
    const currentUser = await verifyAdmin(req);

    // Prevent admin from deleting themselves
    if (currentUser.userId === params.id) {
      throw new ValidationError("Cannot delete your own account");
    }

    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return successResponse({}, 200, "User deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

