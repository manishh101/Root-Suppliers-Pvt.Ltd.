import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { handleApiError, successResponse, ValidationError, AuthError, ForbiddenError } from "@/lib/errors";
import { withValidate } from "@/lib/api-middleware";
import { loginLimiter } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

const secret = process.env.NEXTAUTH_SECRET;

if (!secret) {
  throw new Error("NEXTAUTH_SECRET is not defined");
}

const JWT_SECRET = new TextEncoder().encode(secret);

/**
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password.
 * Returns a JWT token if credentials are valid.
 * Public endpoint with strict rate limiting (5 attempts / 15 mins).
 */
export const POST = withValidate(
  async (req: NextRequest, validatedData: any) => {
    await connectDB();

    const { email, password } = validatedData;

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthError("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenError("Your account has been deactivated");
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create response using standardized helper
    const response = successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      200,
      "Login successful"
    );

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  },
  {
    schema: loginSchema,
    limiter: loginLimiter,
  }
);

