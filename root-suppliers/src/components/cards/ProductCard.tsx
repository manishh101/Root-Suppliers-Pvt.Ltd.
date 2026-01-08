"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    url: string;
    alt?: string;
  }>;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  size?: "default" | "compact";
}

export function ProductCard({ product, view = "grid", size = "default" }: ProductCardProps) {
  const discount = product.price && product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isCompact = size === "compact";

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-lg hover:border-primary-100 transition-all duration-300"
      >
        <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-50">
          <Image
            src={product.images?.[0]?.url || "/images/placeholder.jpg"}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isNew && <Badge className="absolute top-3 left-3 bg-primary-600 text-white shadow-sm">New</Badge>}
          {discount > 0 && <Badge className="absolute top-3 right-3 bg-green-600 text-white shadow-sm">-{discount}%</Badge>}
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Link
                href={`/categories/${product.category?.slug}`}
                className="text-[10px] font-bold text-primary-600/80 uppercase tracking-widest mb-1 hover:text-primary-700 transition-colors"
              >
                {product.category?.name}
              </Link>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-primary-600 transition-colors">
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </h3>
            </div>
            <div className="text-right">
              {product.discountPrice ? (
                <>
                  <span className="block text-lg font-bold text-gray-900">NPR {(product.discountPrice || 0).toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">NPR {(product.price || 0).toLocaleString()}</span>
                </>
              ) : (
                <span className="block text-lg font-bold text-gray-900">NPR {(product.price || 0).toLocaleString()}</span>
              )}
            </div>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Brand: <span className="text-gray-900 font-medium">{product.brand?.name || 'N/A'}</span></span>
            <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group/link">
              View Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white ${isCompact ? 'rounded-xl' : 'rounded-2xl'} shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary-100 transition-all duration-300 flex flex-col`}
    >
      <div className={`relative ${isCompact ? 'aspect-square' : 'aspect-[4/5]'} bg-gray-50 overflow-hidden`}>
        <Image
          src={product.images?.[0]?.url || "/images/placeholder.jpg"}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {product.isNew && <Badge className={`absolute ${isCompact ? 'top-2 left-2 text-[10px] px-1.5 py-0.5' : 'top-3 left-3'} bg-primary-600 text-white shadow-sm`}>New</Badge>}
        {discount > 0 && <Badge className={`absolute ${isCompact ? 'top-2 right-2 text-[10px] px-1.5 py-0.5' : 'top-3 right-3'} bg-green-600 text-white shadow-sm`}>-{discount}%</Badge>}

        {/* Quick View Overlay */}
        <div className={`absolute inset-x-0 bottom-0 ${isCompact ? 'p-2' : 'p-4'} translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10`}>
          <Link href={`/products/${product.slug}`} className={`block w-full ${isCompact ? 'py-2 text-sm' : 'py-3'} bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-center rounded-xl shadow-lg hover:bg-white transition-colors`}>
            View Details
          </Link>
        </div>
      </div>
      <div className={`${isCompact ? 'p-3' : 'p-4'} flex-1 flex flex-col`}>
        <Link
          href={`/categories/${product.category?.slug}`}
          className={`${isCompact ? 'text-[9px]' : 'text-[10px]'} font-bold text-primary-600/80 uppercase tracking-widest mb-1 hover:text-primary-700 transition-colors inline-block`}
        >
          {product.category?.name}
        </Link>
        <h3 className={`font-bold ${isCompact ? 'text-sm' : 'text-base'} text-gray-900 line-clamp-2 ${isCompact ? 'mb-1.5' : 'mb-2'} group-hover:text-primary-600 transition-colors`}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.discountPrice ? (
              <>
                <span className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-400 line-through mr-2`}>NPR {(product.price || 0).toLocaleString()}</span>
                <span className={`block ${isCompact ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>NPR {(product.discountPrice || 0).toLocaleString()}</span>
              </>
            ) : (
              <span className={`block ${isCompact ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>NPR {(product.price || 0).toLocaleString()}</span>
            )}
          </div>
          {product.brand && <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} text-gray-500 font-medium`}>{product.brand.name}</span>}
        </div>
      </div>
    </motion.div>
  );
}
