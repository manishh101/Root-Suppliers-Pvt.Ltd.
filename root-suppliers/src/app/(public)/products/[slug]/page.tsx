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

    const product = await response.json();

    return {
      title: `${product.name} | Root Suppliers`,
      description: product.description?.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160),
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
