"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string | {
    url: string;
    publicId?: string;
  };
  author: {
    name: string;
  };
  publishedAt: string;
  createdAt: string;
  tags: string[];
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/blogs?page=${currentPage}&limit=6&isPublished=true`);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100 pt-12 pb-8 md:pt-20 md:pb-12 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-100 rounded-full blur-2xl opacity-60" />
        </div>

        <div className="container-main relative z-10">
          {/* Header Title */}
          <div className="mb-0 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                LATEST <span className="text-primary-600 block sm:inline">INSIGHTS</span>
              </h1>
              <div className="h-1.5 w-24 bg-primary-600 mt-4 md:mt-6 rounded-full mx-auto md:mx-0" />
              <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                Expert advice, industry news, and tips to help you build better. All your construction knowledge under one roof.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog List Section */}
      <section className="py-12 md:py-16">
        <div className="container-main max-w-5xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="space-y-12">
                {blogs.map((post, index) => {
                  const imageUrl = (typeof post.featuredImage === 'string' ? post.featuredImage : post.featuredImage?.url) || PLACEHOLDER_IMAGES.BLOG;
                  const publicId = typeof post.featuredImage === 'object' ? post.featuredImage?.publicId : undefined;

                  return (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Image Container */}
                        <div className="md:w-2/5 lg:w-1/3 relative overflow-hidden min-h-[250px] md:min-h-full">
                          <CloudinaryImage
                            src={imageUrl}
                            publicId={publicId}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Tags/Category Badge Over Image on Mobile */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="absolute top-4 left-4 md:hidden">
                              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm capitalize">
                                {post.tags[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content Container */}
                        <div className="md:w-3/5 lg:w-2/3 p-8 md:p-10 flex flex-col justify-center relative">
                          {/* Desktop Category Badge */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="hidden md:block mb-4">
                              <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold capitalize tracking-wide">
                                {post.tags[0]}
                              </span>
                            </div>
                          )}

                          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                            <Link href={`/blogs/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>

                          <p className="text-gray-600 mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6 mt-auto w-full pr-14 md:pr-0">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-900 truncate">{post.author?.name || "Team"}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : format(new Date(post.createdAt), "MMM d, yyyy")}
                              </span>
                              {/* Read Time is not in DB, hiding or estimating? For now hiding or static */}
                              {/* <span className="flex items-center gap-1.5 hidden sm:flex">
                              <Clock className="w-4 h-4" /> 5 min read
                            </span> */}
                            </div>
                          </div>

                          {/* Floating Read More Button (Visible on Hover in Desktop, always on Mobile) */}
                          <Link
                            href={`/blogs/${post.slug}`}
                            className="absolute bottom-8 right-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 md:opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                            aria-label="Read Article"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:shadow-sm hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-all ${currentPage === page
                        ? "bg-primary-600 border-primary-600 text-white shadow-md"
                        : "bg-transparent border-gray-200 text-gray-600 hover:bg-white hover:shadow-sm hover:border-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:shadow-sm hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No blog posts found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

