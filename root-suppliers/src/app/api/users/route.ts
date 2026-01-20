import { NextRequest } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse, ValidationError } from "@/lib/errors";

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
    await verifyAdmin(req);

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

    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
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
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Validate password strength
    if (body.password && body.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    // Create user - Password will be hashed by pre-save hook
    const newUser = await User.create({
      name: body.name,
      email: body.email?.toLowerCase(),
      password: body.password,
      role: body.role || "editor",
      avatar: body.avatar || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return successResponse(
      { user: userWithoutPassword },
      201,
      "User created successfully"
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}

