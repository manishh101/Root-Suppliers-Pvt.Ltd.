import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailContent from "./ProductDetailContent";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";

// Revalidate every hour
export const revalidate = 3600;

// Allow dynamic params for products not yet generated
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    // Fetch only the slugs for active products to keep build time reasonable
    const products = await Product.find({ isActive: true }).select("slug").lean();

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    // We can use the DB directly here too for better performance during build
    // but keeping fetch for consistency with existing logic if desired.
    // However, since we are in a server component with DB access, direct DB call is often better for metadata too.
    // Let's stick to fetch for now to match the existing pattern unless it fails.
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return {
        title: "Product Not Found | Root Suppliers",
      };
    }

    const data = await response.json();
    const product = data.product;

    // Ensure product exists and has required fields
    if (!product || !product.name) {
      return {
        title: "Product | Root Suppliers",
      };
    }

    // Use custom SEO meta fields if available, otherwise fall back to product name/description
    const seoTitle = (product.meta?.title && product.meta.title.trim()) || product.name;
    const seoDescription = (product.meta?.description && product.meta.description.trim()) || product.description?.substring(0, 160) || '';

    return {
      title: `${seoTitle} | Root Suppliers`,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
      // Additional SEO tags for better indexing
      keywords: product.tags?.join(', ') || '',
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return {
      title: "Product | Root Suppliers",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <ProductDetailContent slug={slug} />;
}
