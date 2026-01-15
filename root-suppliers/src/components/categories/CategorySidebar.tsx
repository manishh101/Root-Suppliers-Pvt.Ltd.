"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Package, Folder, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
    alt: string;
    publicId?: string;
  };
  productCount?: number;
  children?: CategoryNode[];
}

interface CategorySidebarProps {
  categories: CategoryNode[];
  activeSlug?: string;
  className?: string;
  onLinkClick?: () => void;
}

const CategoryItem = ({
  category,
  depth = 0,
  activeSlug,
  onLinkClick
}: {
  category: CategoryNode;
  depth?: number;
  activeSlug?: string;
  onLinkClick?: () => void;
}) => {
  const isActive = activeSlug === category.slug;
  const hasActiveChild = (cat: CategoryNode): boolean => {
    if (cat.slug === activeSlug) return true;
    return cat.children?.some(hasActiveChild) || false;
  };

  const [isOpen, setIsOpen] = useState(isActive || hasActiveChild(category));
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center justify-between py-2 px-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-primary-50/80 to-primary-50/40 text-primary-700"
            : "text-gray-700 hover:bg-gray-50/60",
          depth > 0 && "ml-4"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 bg-primary-600 rounded-r-full"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        <Link
          href={`/categories/${category.slug}`}
          onClick={onLinkClick}
          className="flex-1 flex items-center gap-2.5 min-w-0 py-0.5"
        >
          <span className={cn(
            "text-sm font-medium truncate transition-colors",
            isActive ? "text-primary-700" : "text-gray-700 group-hover:text-gray-900"
          )}>
            {category.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 flex-shrink-0">
          {category.productCount !== undefined && category.productCount > 0 && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-md font-medium transition-all",
              isActive
                ? "bg-white/80 text-primary-600 shadow-sm"
                : "bg-gray-100/80 text-gray-500 group-hover:bg-gray-200/80"
            )}>
              {category.productCount}
            </span>
          )}

          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className={cn(
                "p-1 rounded-md transition-all hover:bg-white/50",
                isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
              )}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              <ChevronRight
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {category.children!.map((child) => (
                <CategoryItem
                  key={child._id}
                  category={child}
                  depth={depth + 1}
                  activeSlug={activeSlug}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function CategorySidebar({ categories, activeSlug, className, onLinkClick }: CategorySidebarProps) {
  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-sm overflow-hidden", className)}>
      <div className="p-4 border-b border-gray-100/50 bg-gradient-to-b from-gray-50/50 to-transparent">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
          Categories
        </h3>
      </div>

      <div className="p-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        {/* All Products Link */}
        <Link
          href="/categories"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 py-2.5 px-2.5 rounded-lg mb-2 transition-all group relative overflow-hidden",
            !activeSlug
              ? "bg-gradient-to-r from-primary-50/80 to-primary-50/40 text-primary-700"
              : "text-gray-700 hover:bg-gray-50/60"
          )}
        >
          {!activeSlug && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 bg-primary-600 rounded-r-full"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
            />
          )}
          <span className="text-sm font-medium">All Categories</span>
        </Link>

        <div className="space-y-0.5">
          {categories.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
              activeSlug={activeSlug}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
