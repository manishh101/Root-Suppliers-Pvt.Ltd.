import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse, NotFoundError } from "@/lib/errors";
import { blogSchema } from "@/lib/validations";
import { sanitizeHtml } from "@/lib/utils";

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

    const blog = await Blog.findOne(query).populate("author", "name email").lean();

    if (!blog) {
      throw new NotFoundError("Blog post not found");
    }

    return successResponse({ blog });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/blogs/[slug]
 * 
 * Update a blog post by slug.
 * Requires authentication (admin only).
 * 
 * @body Partial<Blog>
 * @returns { success: boolean, blog: object }
 */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Partial validation
    const validatedData = blogSchema.partial().parse(body);

    // Transform and normalize data for Mongoose
    const updateData: any = { ...validatedData };

    // 1. Transform meta fields
    if (validatedData.metaTitle !== undefined || validatedData.metaDescription !== undefined) {
      updateData.meta = {
        title: validatedData.metaTitle || "",
        description: validatedData.metaDescription || "",
      };
      delete updateData.metaTitle;
      delete updateData.metaDescription;
    }

    // 2. Map isActive to isPublished
    if (validatedData.isActive !== undefined) {
      updateData.isPublished = validatedData.isActive;
      delete updateData.isActive;
    }

    // 3. Map order to orderIndex (Blog doesn't have order in model, but shared schema includes it)
    // Blog uses viewCount but not explicit order. We'll just remove 'order' to prevent Mongoose issues.
    delete updateData.order;

    // Sanitize rich text fields
    if (updateData.content) {
      updateData.content = sanitizeHtml(updateData.content);
    }
    if (updateData.excerpt) {
      updateData.excerpt = sanitizeHtml(updateData.excerpt);
    }

    // Set publishedAt if publishing for the first time
    if (updateData.isPublished) {
      const existingBlog = await Blog.findOne({ slug: params.slug });
      if (existingBlog && !existingBlog.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new NotFoundError("Blog post not found");
    }

    // Revalidate all pages that display blogs
    revalidatePath("/", "layout");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    revalidateTag("blogs");

    return successResponse({ blog }, 200, "Blog post updated successfully");
  } catch (error: any) {
    return handleApiError(error);
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
    await verifyAdmin(req);

    await connectDB();

    const blog = await Blog.findOneAndDelete({ slug: params.slug });

    if (!blog) {
      throw new NotFoundError("Blog post not found");
    }

    // Revalidate all pages that display blogs
    revalidatePath("/", "layout");
    revalidatePath("/blogs");
    revalidateTag("blogs");

    return successResponse({}, 200, "Blog post deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

