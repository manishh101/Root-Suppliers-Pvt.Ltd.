import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { handleApiError, successResponse, AuthError } from "@/lib/errors";
import { sanitizeHtml } from "@/lib/utils";

// Ensure models are registered to prevent MissingSchemaError during population
const _models = { Category, Brand };

/**
 * GET /api/products
 * 
 * Fetch all products with optional filters and pagination.
 * Public endpoint.
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 12)
 * - category: string (category slug)
 * - search: string (search in name and description)
 * - isActive: boolean (filter by active status)
 * - sort: string (sortBy field, e.g., "createdAt" or "-createdAt" for desc)
 * 
 * @returns { success: boolean, products: array, pagination: object }
 */
/**
 * GET /api/products
 * 
 * Fetch all products with optional filters and pagination.
 * Public endpoint.
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 12)
 * - category: string (category slug)
 * - search: string (search in name and description)
 * - isActive: boolean (filter by active status)
 * - sort: string (sortBy field, e.g., "createdAt" or "-createdAt" for desc)
 * 
 * @returns { success: boolean, products: array, pagination: object }
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const isTopSelling = searchParams.get("isTopSelling");
    const sort = searchParams.get("sort") || "-createdAt";
    const ids = searchParams.get("ids"); // Comma-separated IDs

    // Build query
    const query: any = {};

    // Filter by category (including subcategories)
    if (categorySlug) {
      const rootCategory = await (Category as any).findOne({ slug: categorySlug }).select("_id");

      if (rootCategory) {
        // Find all descendants recursively
        // Note: This is a simple recursive fetch. For very large trees, a graph lookup or materialized path is better.
        // Assuming the category tree is relatively small (< 100 items), this is fine.
        const getAllDescendantIds = async (parentId: string): Promise<string[]> => {
          const children = await (Category as any).find({ parent: parentId }).select("_id");
          const childIds = children.map((c: any) => c._id.toString());

          let descendantIds = [...childIds];
          for (const childId of childIds) {
            const grandChildIds = await getAllDescendantIds(childId);
            descendantIds = [...descendantIds, ...grandChildIds];
          }
          return descendantIds;
        };

        const descendantIds = await getAllDescendantIds(rootCategory._id.toString());
        query.category = { $in: [rootCategory._id, ...descendantIds] };
      } else {
        // If category not found, return empty or ignore? 
        // Better to return empty to indicate invalid filter
        query.category = null;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isTopSelling !== null && isTopSelling !== undefined) {
      query.isTopSelling = isTopSelling === "true";
    }

    if (ids) {
      const idList = ids.split(",").map((id) => id.trim()).filter((id) => id);
      if (idList.length > 0) {
        query._id = { $in: idList };
      }
    }

    // Filter by brand
    const brandIds = searchParams.get("brand");
    if (brandIds) {
      const brandList = brandIds.split(",").map((id) => id.trim()).filter((id) => id);
      if (brandList.length > 0) {
        query.brand = { $in: brandList };
      }
    }

    // Exclude specific products
    const excludeIds = searchParams.get("exclude");
    if (excludeIds) {
      const excludeList = excludeIds.split(",").map((id) => id.trim()).filter((id) => id);
      if (excludeList.length > 0) {
        if (query._id) {
          query._id = { ...query._id, $nin: excludeList };
        } else {
          query._id = { $nin: excludeList };
        }
      }
    }

    // Filter by tags (find products that have at least one matching tag)
    const tags = searchParams.get("tags");
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t);
      if (tagList.length > 0) {
        query.tags = { $in: tagList };
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("brand", "name slug logo")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}


/**
 * POST /api/products
 * 
 * Create a new product.
 * Requires authentication (admin only).
 * 
 * @body { name, description, shortDescription?, category, images, specifications?, isActive? }
 * @returns { success: boolean, product: object }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Validation using Zod
    const validatedData = productSchema.parse(body);

    // Transform and normalize data for Mongoose
    const productData: any = { ...validatedData };

    // 1. Transform meta fields
    if (validatedData.metaTitle !== undefined || validatedData.metaDescription !== undefined) {
      productData.meta = {
        title: validatedData.metaTitle || "",
        description: validatedData.metaDescription || "",
      };
      delete productData.metaTitle;
      delete productData.metaDescription;
    }

    // 2. Map order to orderIndex
    if (validatedData.order !== undefined) {
      productData.orderIndex = validatedData.order;
      delete productData.order;
    }

    // 3. Normalize brand field (empty string to null to prevent CastError)
    if (productData.brand === "") {
      productData.brand = null;
    }

    // Sanitize rich text fields
    if (productData.description) {
      productData.description = sanitizeHtml(productData.description);
    }
    if (productData.shortDescription) {
      productData.shortDescription = sanitizeHtml(productData.shortDescription);
    }

    // Create product
    const product = await Product.create(productData);

    // Populate category
    await product.populate("category", "name slug");

    return successResponse({ product }, 201, "Product created successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}
