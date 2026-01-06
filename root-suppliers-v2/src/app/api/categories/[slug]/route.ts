import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Category from "@/lib/db/models/Category";
import Product from "@/lib/db/models/Product";
import { verifyAuth } from "@/lib/auth";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug: params.slug }).lean();
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    const productCount = await Product.countDocuments({ category: category._id, isActive: true });
    return NextResponse.json({ success: true, category: { ...category, productCount } }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/categories/${params.slug} error:`, error);
    return NextResponse.json({ success: false, message: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    await connectDB();
    const body = await req.json();
    delete body._id;
    delete body.createdAt;
    const category = await Category.findOneAndUpdate({ slug: params.slug }, { $set: body }, { new: true, runValidators: true });
    if (!category) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, category, message: "Category updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/categories/${params.slug} error:`, error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: "Category with this slug already exists" }, { status: 409 });
    return NextResponse.json({ success: false, message: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    await connectDB();
    const category = await Category.findOne({ slug: params.slug });
    if (!category) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) return NextResponse.json({ success: false, message: `Cannot delete category. It has ${productCount} products. Please reassign or delete products first.` }, { status: 400 });
    const childrenCount = await Category.countDocuments({ parent: category._id });
    if (childrenCount > 0) return NextResponse.json({ success: false, message: `Cannot delete category. It has ${childrenCount} subcategories. Please delete subcategories first.` }, { status: 400 });
    await Category.findByIdAndDelete(category._id);
    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/categories/${params.slug} error:`, error);
    return NextResponse.json({ success: false, message: "Failed to delete category" }, { status: 500 });
  }
}
