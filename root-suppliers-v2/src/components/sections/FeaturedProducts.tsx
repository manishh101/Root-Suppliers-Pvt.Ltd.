"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
  return (
    <section className="py-16 bg-white">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Featured Products
          </h2>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0]?.url || "/images/placeholder-product.jpg"}
                  alt={product.images[0]?.alt || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-primary-600 font-medium uppercase">
                  {product.category?.name || "Uncategorized"}
                </span>
                <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors group"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Static version for when there's no data
export const FeaturedProductsStatic: React.FC = () => {
  const placeholderProducts = [
    { id: 1, name: "Premium Cement", category: "Construction", image: "https://placehold.co/300x300/E5E7EB/333333?text=Cement" },
    { id: 2, name: "Steel Rods", category: "Construction", image: "https://placehold.co/300x300/E5E7EB/333333?text=Steel" },
    { id: 3, name: "Wall Paint", category: "Paints", image: "https://placehold.co/300x300/E5E7EB/333333?text=Paint" },
    { id: 4, name: "Power Tools", category: "Tools", image: "https://placehold.co/300x300/E5E7EB/333333?text=Tools" },
    { id: 5, name: "PVC Pipes", category: "Plumbing", image: "https://placehold.co/300x300/E5E7EB/333333?text=Pipes" },
    { id: 6, name: "Electrical Wires", category: "Electrical", image: "https://placehold.co/300x300/E5E7EB/333333?text=Wires" },
    { id: 7, name: "Safety Helmets", category: "Safety", image: "https://placehold.co/300x300/E5E7EB/333333?text=Safety" },
    { id: 8, name: "Hand Tools", category: "Tools", image: "https://placehold.co/300x300/E5E7EB/333333?text=Hand+Tools" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Featured Products
          </h2>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {placeholderProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-primary-600 font-medium uppercase">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors group"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
