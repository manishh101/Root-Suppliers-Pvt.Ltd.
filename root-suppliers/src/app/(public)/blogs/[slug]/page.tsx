"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    url: string;
  };
  author: {
    name: string;
  };
  publishedAt: string;
  createdAt: string;
  tags: string[];
}

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      if (!params.slug) return;

      try {
        const res = await fetch(`/api/blogs/${params.slug}`);
        const data = await res.json();

        if (data.success) {
          setBlog(data.blog);
        } else {
          setError(data.message || "Failed to fetch blog post");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("An error occurred while loading the blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full bg-gray-900 overflow-hidden">
        {blog.featuredImage?.url ? (
          <Image
            src={blog.featuredImage.url}
            alt={blog.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-gray-900 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-main max-w-4xl text-center text-white relative z-10 p-4">
            {blog.tags && blog.tags.length > 0 && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary-600/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide mb-6">
                {blog.tags[0]}
              </span>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white"
            >
              {blog.title}
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-gray-300 text-sm md:text-base">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{blog.author?.name || "Team"}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{blog.publishedAt ? format(new Date(blog.publishedAt), "MMMM d, yyyy") : format(new Date(blog.createdAt), "MMMM d, yyyy")}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
                </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container-main max-w-4xl -mt-20 relative z-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 lg:p-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary-600 font-medium mb-8 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>

          <div className="prose prose-lg prose-blue max-w-none">
            {/* We render HTML content. Ensure you trust the source or use a sanitization library if needed. 
                    Since this is from our admin panel, we assume it's relatively safe, but dangerouslySetInnerHTML is... dangerous.
                */}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
