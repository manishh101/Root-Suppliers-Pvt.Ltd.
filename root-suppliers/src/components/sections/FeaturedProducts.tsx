"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Eye } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  images: { url: string; alt: string }[];
  category: { name: string; slug: string };
  isFeatured: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-white px-4 md:px-0">
      <div className="container-main">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="section-title">
            Featured Products
          </h2>
          <p className="section-subtitle">
            Curated selection of top-quality construction materials and tools
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 8).map((product, index) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className={`group flex flex-col bg-transparent transition-all duration-500 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-4 border border-gray-100 group-hover:border-gray-200 group-hover:shadow-lg transition-all duration-300">
                <CloudinaryImage
                  src={product.images[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                  alt={product.images[0]?.alt || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                    Featured
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <p className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {product.category?.name}
                </p>
                <h3 className="text-xs md:text-base font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors font-secondary capitalize">
                  {product.name.toLowerCase()}
                </h3>
                <div className="mt-auto pt-2 flex items-center text-sm font-medium text-primary-600 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 md:mt-20">
          <Link
            href="/products"
            className="btn btn-outline rounded-full px-8 py-3 hover:bg-secondary-600 hover:text-white hover:border-secondary-600 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

// Static version for when there's no data
export const FeaturedProductsStatic: React.FC = () => {
  // Reuse similar structure for static version if needed, or just return null/skeleton
  // For now I'll keep it simple as it's rarely used if data fetching works
  return null;
};

export default FeaturedProducts;
