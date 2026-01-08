import React from "react";
import Link from "next/link";
import Image from "next/image";

interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  website?: string;
  isActive: boolean;
}

export interface BrandCardProps {
  brand: IBrand;
}

/**
 * Brand Card Component
 * 
 * Displays brand logo in a card format.
 * Used in brand carousels and listings.
 * 
 * @example
 * ```tsx
 * <BrandCard brand={brandData} />
 * ```
 */
export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-8 flex items-center justify-center h-32 group">
      <div className="relative h-20 w-full">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          className="object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
    </div>
  );

  if (brand.website) {
    return (
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${brand.name} website`}
      >
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};
