import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { handleApiError, successResponse, AuthError, NotFoundError, ForbiddenError } from "@/lib/errors";

// Force this route to be dynamic (uses cookies)
export const dynamic = 'force-dynamic';
// Use Node.js runtime for database operations
export const runtime = 'nodejs';

// Get JWT secret lazily to avoid build-time issues
function getJWTSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined");
  }
  return new TextEncoder().encode(secret);
}

/**
 * GET /api/auth/session
 * 
 * Returns the current authenticated user's information.
 * Requires valid JWT token in cookies.
 * 
 * @returns { success: boolean, user?: object, message?: string }
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      throw new AuthError("Not authenticated");
    }

    // Verify token
    const { payload } = await jwtVerify(token, getJWTSecret());

    await connectDB();

    // Get user from database
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account deactivated");
    }

    return successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

