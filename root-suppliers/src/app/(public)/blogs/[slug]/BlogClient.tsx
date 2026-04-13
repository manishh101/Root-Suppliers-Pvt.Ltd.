"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    url: string;
    publicId?: string;
    alt?: string;
  };
  author: {
    name: string;
    email?: string;
  } | string; // Handle populated or ID
  publishedAt: string;
  createdAt: string;
  tags: string[];
}

interface BlogClientProps {
  blog: BlogPost;
}

export default function BlogClient({ blog }: BlogClientProps) {
  // Helper to get author name safely
  const getAuthorName = () => {
    if (typeof blog.author === 'object' && blog.author !== null) {
      return (blog.author as any).name || "Team";
    }
    return "Team"; // Fallback if it's just an ID or missing
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full bg-gray-900 overflow-hidden">
        <CloudinaryImage
          src={blog.featuredImage?.url || PLACEHOLDER_IMAGES.BLOG}
          publicId={blog.featuredImage?.publicId}
          alt={blog.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-main max-w-4xl text-center text-white relative z-10 p-4">
            {blog.tags && blog.tags.length > 0 && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary-600/80 backdrop-blur-sm text-white text-xs font-bold capitalize tracking-wide mb-6">
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
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{blog.publishedAt ? format(new Date(blog.publishedAt), "MMMM d, yyyy") : format(new Date(blog.createdAt), "MMMM d, yyyy")}</span>
              </div>
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
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 capitalize tracking-wide mb-4">Tags</h3>
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
