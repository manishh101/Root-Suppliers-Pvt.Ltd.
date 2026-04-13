"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CategorySidebar, CategoryNode } from "@/components/categories/CategorySidebar";

interface MobileCategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function buildCategoryTree(categories: any[]): CategoryNode[] {
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

export default function MobileCategoryMenu({ isOpen, onClose }: MobileCategoryMenuProps) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await fetch("/api/categories?includeProductCount=true&isActive=true");
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setCategories(buildCategoryTree(data.categories));
            }
          }
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[61] bg-white rounded-t-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col pb-safe"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-primary-700">
                <Package className="w-5 h-5" />
                <h3 className="font-bold text-base">Categories</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm">Loading categories...</p>
                </div>
              ) : (
                <div className="category-menu-content">
                  <CategorySidebar
                    categories={categories}
                    className="border-none shadow-none bg-transparent !p-0"
                    onLinkClick={onClose}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-md shadow-primary-600/20"
              >
                Close Categories
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
