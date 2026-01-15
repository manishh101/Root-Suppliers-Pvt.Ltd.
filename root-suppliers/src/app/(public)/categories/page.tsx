"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Package, ArrowRight } from "lucide-react";
import { CategorySidebar, CategoryNode } from "@/components/categories/CategorySidebar";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  image?: {
    url: string;
    alt: string;
    publicId?: string;
  };
  productCount?: number;
}

function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  categories.forEach((cat) => categoryMap.set(cat._id, { ...cat, children: [] }));
  categories.forEach((cat) => {
    const node = categoryMap.get(cat._id)!;
    if (cat.parent && categoryMap.has(cat.parent)) {
      categoryMap.get(cat.parent)!.children!.push(node);
    } else {
      rootCategories.push(node);
    }
  });
  return rootCategories;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?includeProductCount=true&isActive=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCategories(data.categories);
            setCategoryTree(buildCategoryTree(data.categories));
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = categoryTree;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Refined Header */}
      <section className="relative py-12 md:py-24 overflow-hidden border-b border-gray-100/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.04),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.03),transparent_50%)]" />

        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50/50 text-primary-700 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-primary-100/50">
                <Package className="w-3.5 h-3.5" />
                <span>Product Catalog</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                Browse Categories
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Explore our comprehensive catalog of construction materials and supplies, organized for your convenience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 z-20">
              <CategorySidebar categories={categoryTree} activeSlug={undefined} />
            </div>

            {/* Category Grid */}
            <div className="lg:col-span-9">
              {/* Stats */}
              <div className="mb-8">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{categories.length}</span> categories available
                </p>
              </div>

              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    <p className="text-sm text-gray-500">Loading categories...</p>
                  </div>
                </div>
              ) : displayCategories.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-100/50">
                  <div className="w-16 h-16 bg-gray-100/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-500 text-sm">Check back later for updates</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  <AnimatePresence mode="popLayout">
                    {displayCategories.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.04 }}
                        className="group"
                      >
                        <Link
                          href={`/categories/${item.slug}`}
                          className="block h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200/50 transition-all duration-300 flex flex-col relative"
                        >
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                            <CloudinaryImage
                              src={item.image?.url || PLACEHOLDER_IMAGES.PRODUCT}
                              publicId={item.image?.publicId}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Content */}
                          <div className="p-4 flex-1 flex flex-col relative bg-gradient-to-b from-white to-gray-50/30">
                            <h3 className="font-semibold text-base text-gray-900 mb-1.5 leading-snug group-hover:text-primary-600 transition-colors">
                              {item.name}
                            </h3>

                            <div className="flex items-center justify-between mt-auto pt-2">
                              <p className="text-xs text-gray-500 font-medium">
                                {item.children?.length
                                  ? `${item.children.length} subcategories`
                                  : `${item.productCount || 0} products`}
                              </p>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

