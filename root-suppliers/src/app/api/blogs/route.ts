import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";
import User from "@/lib/db/models/User";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/errors";

// Ensure models are registered
const _models = { Blog, User };

/**
 * GET /api/blogs
 * 
 * Fetch all blog posts with optional filters and pagination.
 * Public endpoint (only returns published blogs for non-authenticated users).
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - search: string (search in title and excerpt)
 * - tags: string (comma-separated tags)
 * - isPublished: boolean (admin only)
 * - sort: string (default: "-publishedAt")
 * 
 * @returns { success: boolean, blogs: array, pagination: object }
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await verifyAuth(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const tags = searchParams.get("tags");
    const isPublished = searchParams.get("isPublished");
    const sort = searchParams.get("sort") || "-publishedAt";

    // Build query
    const query: any = {};

    // Non-authenticated users can only see published blogs
    if (!user) {
      query.isPublished = true;
    } else if (isPublished !== null && isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(",").map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch blogs
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate("author", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({
      blogs,
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
 * POST /api/blogs
 * 
 * Create a new blog post.
 * Requires authentication (admin only).
 * 
 * @body { title, content, excerpt, featuredImage, author, tags?, isPublished? }
 * @returns { success: boolean, blog: object }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Set author if not provided
    if (!body.author) {
      body.author = user.userId;
    }

    // Set publishedAt if publishing
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    // Create blog
    const blog = await Blog.create(body);

    return successResponse({ blog }, 201, "Blog post created successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}

