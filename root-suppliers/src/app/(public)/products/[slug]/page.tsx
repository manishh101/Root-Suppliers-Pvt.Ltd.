import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailContent from "./ProductDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
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
