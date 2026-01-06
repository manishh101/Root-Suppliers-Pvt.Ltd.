import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date;
  tags?: string[];
  isPublished: boolean;
}

export interface BlogCardProps {
  blog: IBlog;
}

/**
 * Blog Card Component
 * 
 * Displays blog post information in a card format.
 * Used in blog listings and homepage.
 * 
 * @example
 * ```tsx
 * <BlogCard blog={blogData} />
 * ```
 */
export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const image = blog.featuredImage || "/placeholder-blog.jpg";
  const publishDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Featured Image */}
      <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {publishDate}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {blog.author}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all group"
        >
          Read More
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
