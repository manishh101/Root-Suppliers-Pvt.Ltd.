import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Eye, MessageSquare } from "lucide-react";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category?: ICategory | string;
  isActive: boolean;
}

export interface ProductCardProps {
  product: IProduct;
  onInquire?: () => void;
}

/**
 * Product Card Component
 * 
 * Displays product information in a card format.
 * Used in product listings and homepage.
 * 
 * @example
 * ```tsx
 * <ProductCard
 *   product={productData}
 *   onInquire={() => openInquiryModal(product)}
 * />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onInquire }) => {
  const primaryImage = product.images?.[0] || "/placeholder-product.jpg";

  return (
    <div className="group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold text-sm">
              Inactive
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {product.category && (
          <Badge variant="secondary" className="mb-2">
            {typeof product.category === 'string' ? product.category : product.category.name}
          </Badge>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </Link>
          {onInquire && (
            <Button
              variant="primary"
              size="sm"
              onClick={onInquire}
            >
              <MessageSquare className="h-4 w-4" />
              Inquire
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
