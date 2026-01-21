import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";
import connectDB from "@/lib/db/connect";
import Blog from "@/lib/db/models/Blog";

// Revalidate every 60 seconds (1 minute) for faster updates
export const revalidate = 60;

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

    if (!blog) return null;

    // Transform to plain object to handle MongoDB specific types like ObjectId and Date
    return JSON.parse(JSON.stringify(blog));
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
      publishedTime: String(blog.publishedAt || blog.createdAt || new Date().toISOString()),
      authors: [blog.author && typeof blog.author === 'object' ? (blog.author as any).name : 'Root Suppliers'],
      images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
    } as any,
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
    },
    keywords: blog.tags?.join(', ') || '',
  };
}

// Generate article structured data for SEO
function getArticleStructuredData(blog: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || "",
    image: blog.featuredImage?.url || "",
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author && typeof blog.author === 'object' ? blog.author.name : 'Root Suppliers',
    },
    publisher: {
      "@type": "Organization",
      name: "Root Suppliers",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rootsuppliers.com.np'}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rootsuppliers.com.np'}/blogs/${blog.slug}`,
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

  const structuredData = getArticleStructuredData(blog);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogClient blog={blog as any} />
    </>
  );
}
