import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * GET /api/users
 * 
 * Fetch all users with pagination.
 * Requires authentication (admin only).
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - role: 'admin' | 'editor'
 * - search: string (search by name or email)
 * - isActive: 'true' | 'false'
 * 
 * @returns { success: boolean, users: array, pagination: object }
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

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    // Build query
    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== null && isActive !== "") {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Fetch users (exclude password field)
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * 
 * Create a new user.
 * Requires authentication (admin only).
 * 
 * @body { name, email, password, role?, avatar?, isActive? }
 * @returns { success: boolean, user: object }
 */
export async function POST(req: NextRequest) {
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

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Validate password strength
    if (body.password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user - Password will be hashed by pre-save hook
    const newUser = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password,
      role: body.role || "editor",
      avatar: body.avatar || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
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
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}
