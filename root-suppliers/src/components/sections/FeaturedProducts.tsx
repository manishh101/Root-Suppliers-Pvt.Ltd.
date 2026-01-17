"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Eye, MessageCircle } from "lucide-react";
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
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-5 py-2 bg-primary-100 text-primary-700 text-xs md:text-base font-bold rounded-full mb-6 capitalize">
            Our Best Sellers
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our top-rated construction and hardware supplies trusted by professionals
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mt-6 rounded-full" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-primary-200/40 transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-300 hover:-translate-y-1.5 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Animated glow ring on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary-400/0 group-hover:ring-primary-400/30 transition-all duration-500 pointer-events-none" />
              {/* Featured Badge */}
              {product.isFeatured && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="flex items-center justify-center w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-all hover:scale-110">
                  <Eye className="h-4 w-4" />
                </span>
                <span className="flex items-center justify-center w-9 h-9 bg-green-500 rounded-full shadow-lg hover:bg-green-600 text-white transition-all hover:scale-110">
                  <MessageCircle className="h-4 w-4" />
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-3">
                <CloudinaryImage
                  src={product.images[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                  alt={product.images[0]?.alt || product.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out p-2 mix-blend-multiply"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-3 md:p-4 bg-gradient-to-t from-gray-50/80 to-white">
                <span className="inline-block px-2 py-0.5 text-xs font-bold text-primary-600 bg-primary-50 rounded-full mb-1.5">
                  {product.category?.name || "Uncategorized"}
                </span>
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                  {product.name}
                </h3>

                {/* View Product Link */}
                <div className="mt-2 flex items-center text-sm font-bold text-gray-500 group-hover:text-primary-600 transition-colors capitalize">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-2 px-5 py-3 md:px-10 md:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:text-white font-bold rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary-200/50 transform hover:-translate-y-1 hover:scale-[1.02] font-primary overflow-hidden"
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative text-xs md:text-base tracking-wide capitalize">Explore all products</span>
            <ArrowRight className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform relative" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Browse our complete collection of products
          </p>
        </div>
      </div>
    </section>
  );
};

// Static version for when there's no data
export const FeaturedProductsStatic: React.FC = () => {
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

  const placeholderProducts = [
    { id: 1, name: "Premium Portland Cement 50kg", category: "Construction Materials", image: PLACEHOLDER_IMAGES.PRODUCT, featured: true },
    { id: 2, name: "TMT Steel Reinforcement Bars", category: "Construction Materials", image: PLACEHOLDER_IMAGES.PRODUCT, featured: true },
    { id: 3, name: "Asian Paints Royale Luxury", category: "Paints & Coatings", image: PLACEHOLDER_IMAGES.PRODUCT, featured: false },
    { id: 4, name: "Professional Cordless Drill Set", category: "Power Tools", image: PLACEHOLDER_IMAGES.PRODUCT, featured: false },
    { id: 5, name: "UPVC Pipes & Fittings Kit", category: "Plumbing", image: PLACEHOLDER_IMAGES.PRODUCT, featured: false },
    { id: 6, name: "Premium Electrical Wiring Set", category: "Electrical", image: PLACEHOLDER_IMAGES.PRODUCT, featured: true },
    { id: 7, name: "Industrial Safety Helmet", category: "Safety Equipment", image: PLACEHOLDER_IMAGES.PRODUCT, featured: false },
    { id: 8, name: "Complete Hand Tools Kit", category: "Tools & Hardware", image: PLACEHOLDER_IMAGES.PRODUCT, featured: false },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-5 py-2 bg-primary-100 text-primary-700 text-sm md:text-base font-bold rounded-full mb-6 capitalize tracking-wider">
            Our Best Sellers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our top-rated construction and hardware supplies trusted by professionals
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mt-6 rounded-full" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {placeholderProducts.map((product, index) => (
            <Link
              key={product.id}
              href="/products"
              className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </div>
              )}

              {/* Quick View Button */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="flex items-center justify-center w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-primary-600 hover:text-white transition-colors">
                  <Eye className="h-4 w-4" />
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-6">
                <CloudinaryImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out p-4 mix-blend-multiply"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <span className="inline-block px-3 py-1 text-sm font-bold text-primary-600 bg-primary-50 rounded-full mb-3">
                  {product.category}
                </span>
                <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                  {product.name}
                </h3>

                {/* View Product Link */}
                <div className="mt-4 flex items-center text-sm md:text-base font-bold text-gray-500 group-hover:text-primary-600 transition-colors capitalize tracking-wider">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-14 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:text-white font-bold rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-100/50 group transform hover:-translate-y-0.5"
          >
            <span>Explore all products</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Browse our complete collection of 1000+ products
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
