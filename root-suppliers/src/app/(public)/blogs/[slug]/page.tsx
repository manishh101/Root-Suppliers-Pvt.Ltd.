import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Root Suppliers",
    };
  }

  // Use custom SEO meta fields if available, otherwise fall back to blog title/excerpt
  const seoTitle = (blog.meta?.title && blog.meta.title.trim()) || blog.title;
  const seoDescription = (blog.meta?.description && blog.meta.description.trim()) || blog.excerpt?.substring(0, 160) || '';

  return {
    title: `${seoTitle} | Root Suppliers`,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [typeof blog.author === 'object' ? blog.author.name : 'Root Suppliers'],
      images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
    },
    keywords: blog.tags?.join(', ') || '',
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return <BlogClient blog={blog} />;
}
