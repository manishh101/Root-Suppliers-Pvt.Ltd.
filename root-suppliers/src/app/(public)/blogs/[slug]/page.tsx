import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";

// Revalidate every hour
export const revalidate = 3600;

// Allow dynamic params
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true }).select("slug").lean();
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blogs:", error);
    return [];
  }
}

async function getBlog(slug: string) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, isPublished: true })
      .populate("author", "name avatar")
      .lean();

    return blog;
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
