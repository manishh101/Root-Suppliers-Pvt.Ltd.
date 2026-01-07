"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Paintbrush, Wrench, Zap, Pipette, HardHat, Hammer, Ruler, Package } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const iconMap: Record<string, React.ElementType> = {
  Package,
  Paintbrush,
  Wrench,
  Zap,
  Pipette,
  HardHat,
  Hammer,
  Ruler,
};

const defaultCategories = [
  { _id: "1", name: "Paints & Coatings", slug: "paints", icon: "Paintbrush" },
  { _id: "2", name: "Tools & Hardware", slug: "tools", icon: "Wrench" },
  { _id: "3", name: "Electrical Items", slug: "electrical", icon: "Zap" },
  { _id: "4", name: "Plumbing Supplies", slug: "plumbing", icon: "Pipette" },
  { _id: "5", name: "Safety Equipment", slug: "safety", icon: "HardHat" },
  { _id: "6", name: "Construction", slug: "construction", icon: "Hammer" },
  { _id: "7", name: "Measuring Tools", slug: "measuring", icon: "Ruler" },
  { _id: "8", name: "Other Products", slug: "other", icon: "Package" },
];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Product Categories
          </h2>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category) => {
            const IconComponent = iconMap[category.icon || "Package"] || Package;
            return (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <IconComponent className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-700 text-white font-semibold rounded-lg hover:bg-secondary-800 transition-colors group"
          >
            VIEW ALL CATEGORIES
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export const CategoriesSectionStatic: React.FC = () => {
  return <CategoriesSection categories={defaultCategories} />;
};

export default CategoriesSection;
