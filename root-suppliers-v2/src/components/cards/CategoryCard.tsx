import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  isActive: boolean;
}

export interface CategoryCardProps {
  category: ICategory;
}

/**
 * Category Card Component
 * 
 * Displays category information in a card format.
 * Used in category listings and homepage.
 * 
 * @example
 * ```tsx
 * <CategoryCard category={categoryData} />
 * ```
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const image = category.image || "/placeholder-category.jpg";

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
        <Image
          src={image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary-300 transition-colors">
            {category.name}
          </h3>
          {category.productCount !== undefined && (
            <p className="text-sm text-white/90">
              {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
            </p>
          )}
        </div>
      </div>

      {/* View Link */}
      <div className="p-4 flex items-center justify-between bg-gray-50 group-hover:bg-primary-50 transition-colors">
        <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
          View Products
        </span>
        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
