"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
    publicId?: string;
  };
  productCount?: number;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden" ref={ref}>
      <div className="container-main">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <span className="text-primary-600 font-bold tracking-wider capitalize text-sm mb-2 block">
              Our Catalog
            </span>
            <h2 className="font-primary font-bold text-2xl sm:text-3xl md:text-5xl text-gray-900 leading-tight whitespace-nowrap">
              Browse by <span className="text-primary-600">Category</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/categories"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm hover:shadow-md"
            >
              View All Categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category._id} variants={itemVariants}>
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
                  <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    <CloudinaryImage
                      src={category.image?.url || PLACEHOLDER_IMAGES.PRODUCT}
                      publicId={category.image?.publicId}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg md:text-xl font-bold mb-1 truncate !text-white">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {category.productCount} Products
                    </p>
                  )}
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-600/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


export const CategoriesSectionStatic: React.FC = () => {
  return <CategoriesSection categories={[]} />;
};

export default CategoriesSection;
