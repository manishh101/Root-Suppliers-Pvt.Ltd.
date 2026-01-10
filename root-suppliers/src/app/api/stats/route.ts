import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import Blog from "@/lib/db/models/Blog";
import Inquiry from "@/lib/db/models/Inquiry";
import User from "@/lib/db/models/User";
import Brand from "@/lib/db/models/Brand";
import Testimonial from "@/lib/db/models/Testimonial";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/errors";

/**
 * GET /api/stats
 * 
 * Fetch dashboard statistics.
 * Requires authentication.
 * 
 * Query Parameters:
 * - type: 'overview' | 'inquiries' | 'products' (default: 'overview')
 * 
 * @returns { success: boolean, stats: object }
 */
export async function GET(req: NextRequest) {
  try {
    // Stats are typically for admin/editor use
    await verifyAuth(req);

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") || "overview";

    let stats: any = {};

    if (type === "overview") {
      // Get counts for all content types
      const [
        totalProducts,
        activeProducts,
        totalCategories,
        activeCategories,
        totalBlogs,
        publishedBlogs,
        totalInquiries,
        newInquiries,
        totalUsers,
        activeUsers,
        totalBrands,
        totalTestimonials,
        activeTestimonials,
      ] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Category.countDocuments(),
        Category.countDocuments({ isActive: true }),
        Blog.countDocuments(),
        Blog.countDocuments({ isPublished: true }),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: "new" }),
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Brand.countDocuments(),
        Testimonial.countDocuments(),
        Testimonial.countDocuments({ isActive: true }),
      ]);

      // Get recent inquiries
      const recentInquiries = await Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // Get recent products
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name slug images isActive createdAt")
        .lean();

      stats = {
        products: {
          total: totalProducts,
          active: activeProducts,
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        brands: {
          total: totalBrands,
        },
        testimonials: {
          total: totalTestimonials,
          active: activeTestimonials,
        },
        recentInquiries,
        recentProducts,
      };
    } else if (type === "inquiries") {
      // Get inquiry statistics by status
      const [
        totalInquiries,
        newCount,
        contactedCount,
        convertedCount,
        closedCount,
      ] = await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: "new" }),
        Inquiry.countDocuments({ status: "contacted" }),
        Inquiry.countDocuments({ status: "converted" }),
        Inquiry.countDocuments({ status: "closed" }),
      ]);

      // Get inquiries by source
      const inquiriesBySource = await Inquiry.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get recent inquiries
      const recentInquiries = await Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      // Get inquiries over time (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const inquiriesOverTime = await Inquiry.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      stats = {
        total: totalInquiries,
        byStatus: {
          new: newCount,
          contacted: contactedCount,
          converted: convertedCount,
          closed: closedCount,
        },
        bySource: inquiriesBySource,
        recentInquiries,
        inquiriesOverTime,
      };
    } else if (type === "products") {
      // Get product statistics by category
      const productsByCategory = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            categoryId: "$_id",
            categoryName: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Get featured products count
      const featuredCount = await Product.countDocuments({
        isFeatured: true,
        isActive: true,
      });

      // Get products with low stock (assuming stock < 10 is low)
      const lowStockProducts = await Product.find({
        isActive: true,
        "variants.stock": { $lt: 10 },
      })
        .select("name slug variants")
        .limit(10)
        .lean();

      stats = {
        byCategory: productsByCategory,
        featured: featuredCount,
        lowStockProducts,
      };
    }

    return successResponse({ stats });
  } catch (error) {
    return handleApiError(error);
  }
}

