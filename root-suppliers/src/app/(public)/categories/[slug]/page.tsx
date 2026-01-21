import { Metadata } from "next";
import { Suspense } from "react";
import connectDB from "@/lib/db/connect";
import Category from "@/lib/db/models/Category";
import CategoryClient from "./CategoryClient";
import { Loader2 } from "lucide-react";

// Revalidate every 60 seconds for faster updates
export const revalidate = 60;

// Allow dynamic params
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).select("slug").lean();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const category = await Category.findOne({ slug }).select("name description meta").lean();

    if (!category) {
      return {
        title: "Category Not Found | Root Suppliers",
      };
    }

    const seoTitle = (category.meta?.title && category.meta.title.trim()) || category.name;
    const seoDescription = (category.meta?.description && category.meta.description.trim()) || category.description?.substring(0, 160) || '';

    return {
      title: `${seoTitle} | Root Suppliers`,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
      },
    };
  } catch {
    return {
      title: "Category | Root Suppliers",
    };
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>}>
      <CategoryClient slug={slug} />
    </Suspense>
  );
}
