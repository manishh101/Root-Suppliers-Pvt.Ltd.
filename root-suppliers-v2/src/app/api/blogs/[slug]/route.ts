import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";
import { verifyAuth } from "@/lib/auth";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/blogs/[slug]
 * 
 * Fetch a single blog post by slug.
 * Public endpoint (only published blogs for non-authenticated users).
 * 
 * @returns { success: boolean, blog: object }
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const user = await verifyAuth(req);
    const query: any = { slug: params.slug };

    // Non-authenticated users can only see published blogs
    if (!user) {
      query.isPublished = true;
    }

    const blog = await Blog.findOne(query).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/blogs/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blogs/[slug]
 * 
 * Update a blog post by slug.
 * Requires authentication (admin/editor).
 * 
 * @body Partial<Blog>
 * @returns { success: boolean, blog: object }
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

    await connectDB();

    const body = await req.json();

    // Don't allow changing _id or createdAt
    delete body._id;
    delete body.createdAt;

    // Set publishedAt if publishing for the first time
    if (body.isPublished && !body.publishedAt) {
      const existingBlog = await Blog.findOne({ slug: params.slug });
      if (existingBlog && !existingBlog.publishedAt) {
        body.publishedAt = new Date();
      }
    }

    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        blog,
        message: "Blog post updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/blogs/${params.slug} error:`, error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Blog with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[slug]
 * 
 * Delete a blog post by slug.
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

    const blog = await Blog.findOneAndDelete({ slug: params.slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/blogs/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
