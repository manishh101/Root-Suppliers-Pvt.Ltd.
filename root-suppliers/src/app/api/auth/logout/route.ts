import { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/lib/errors";

// Force this route to be dynamic (uses cookies)
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * 
 * Logs out the current user by clearing the auth token cookie.
 * 
 * @returns { success: boolean, message: string }
 */
export async function POST() {
  try {
    const response = successResponse({}, 200, "Logout successful");

    // Clear the auth token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

