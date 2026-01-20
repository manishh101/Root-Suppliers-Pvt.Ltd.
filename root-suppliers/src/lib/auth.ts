import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AuthError, ForbiddenError } from "@/lib/errors";

// Get secret lazily to avoid build-time errors
function getJWTSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined");
  }
  return new TextEncoder().encode(secret);
}

export interface AuthUser {
  userId: string;
  email: string;
  role: "admin" | "editor";
}

/**
 * Verify JWT token and return user data
 * 
 * @param req - Next.js request object
 * @returns AuthUser object or null if invalid
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getJWTSecret());

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "admin" | "editor",
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

/**
 * Check if user has required role
 * 
 * @param user - Authenticated user
 * @param allowedRoles - Array of allowed roles
 * @returns boolean
 */
export function hasRole(user: AuthUser | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
/**
 * Verify if the request is from an authenticated admin
 * 
 * @param req - Next.js request object
 * @throws {AuthError} if not authenticated
 * @throws {ForbiddenError} if not an admin
 * @returns AuthUser object
 */
export async function verifyAdmin(req: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(req);
  if (!user) {
    throw new AuthError();
  }
  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}
