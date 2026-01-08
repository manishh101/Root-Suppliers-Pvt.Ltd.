"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
}

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
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

  // Use dynamic categories if available
  const displayCategories = categories && categories.length > 0 ? categories : [];

  if (displayCategories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Subtle Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-50/30 rounded-full blur-[120px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary-50/30 rounded-full blur-[100px] -ml-24 -mb-24" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-5 border border-primary-100">
            Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Our Categories
          </h2>
          <div className="w-16 h-1.5 bg-primary-600 mx-auto mt-6 rounded-full" />
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our professional-grade construction materials and hardware solutions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayCategories.map((category, index) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className={`group relative h-[300px] overflow-hidden rounded-[2rem] bg-gray-100 transition-all duration-700 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16 shadow-none'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image with overlay */}
              <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <Image
                  src={category.image?.url || "/images/placeholder.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                {/* Modern Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 overflow-hidden h-0 group-hover:h-6 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <span className="text-white/80 text-sm font-medium">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Highlight Border on Hover */}
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-secondary-600 text-white font-bold rounded-2xl hover:bg-secondary-700 transition-all duration-300 shadow-xl hover:shadow-secondary-200/50 transform hover:-translate-y-1"
          >
            <span className="tracking-widest text-sm">VIEW ALL CATEGORIES</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const CategoriesSectionStatic: React.FC = () => {
  return <CategoriesSection categories={[]} />;
};

export default CategoriesSection;
