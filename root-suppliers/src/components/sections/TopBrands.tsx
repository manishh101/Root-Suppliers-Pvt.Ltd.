"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  logo: { url: string; publicId: string };
  website?: string;
}

interface TopBrandsProps {
  brands: Brand[];
}

export const TopBrands: React.FC<TopBrandsProps> = ({ brands }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background patterns could be added here for extra premium feel */}
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-600"></div>
            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-600"></div>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mb-2">
            Top Brands
          </h2>
          <p className="text-sm text-gray-600 uppercase tracking-widest">Under One Roof</p>
        </div>

        {/* Brands Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white hover:bg-primary-600 border-2 border-gray-200 hover:border-primary-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white hover:bg-primary-600 border-2 border-gray-200 hover:border-primary-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          <div className="overflow-hidden px-4 md:px-8" ref={emblaRef}>
            <div className="flex gap-6">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex-none w-44 h-36"
                >
                  <div className="bg-white rounded-xl p-5 h-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 via-primary-50/0 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={brand.logo?.url || "/images/placeholder-brand.png"}
                      alt={brand.name}
                      width={120}
                      height={60}
                      className="object-contain max-h-24 relative z-10 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary-400"></div>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"></div>
            <div className="h-1 w-1 rounded-full bg-secondary-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Static version with placeholder brands
export const TopBrandsStatic: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const placeholderBrands = [
    { name: "Asian Paints", logo: "/images/brands/asianpaints.png" },
    { name: "Delta Laminates", logo: "/images/brands/delta-laminates.png" },
    { name: "INCCO", logo: "/images/brands/incco.png" },
    { name: "Jagadamba Steel", logo: "/images/brands/jagadamba-steel.png" },
    { name: "Litmus", logo: "/images/brands/litmus.png" },
    { name: "Sarvo", logo: "/images/brands/sarvo.png" },
    { name: "Sika", logo: "/images/brands/sika.png" },
    { name: "Surya Ply", logo: "/images/brands/surya-ply.png" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-600"></div>
            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-600"></div>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mb-2">
            Top Brands
          </h2>
          <p className="text-sm text-gray-600 uppercase tracking-widest">Under One Roof</p>
        </div>

        {/* Brands Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white hover:bg-primary-600 border-2 border-gray-200 hover:border-primary-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white hover:bg-primary-600 border-2 border-gray-200 hover:border-primary-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          <div className="overflow-hidden px-8" ref={emblaRef}>
            <div className="flex gap-6">
              {placeholderBrands.map((brand, index) => (
                <div
                  key={index}
                  className="flex-none w-44 h-36"
                >
                  <div className="bg-white rounded-xl p-5 h-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 via-primary-50/0 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={120}
                      height={60}
                      className="object-contain max-h-24 relative z-10 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary-400"></div>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600"></div>
            <div className="h-1 w-1 rounded-full bg-secondary-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
