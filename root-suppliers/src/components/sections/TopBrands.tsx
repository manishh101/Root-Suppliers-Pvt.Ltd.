"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

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
  const placeholderBrands = [
    { _id: "p1", name: "Asian Paints", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p2", name: "Delta Laminates", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p3", name: "INCCO", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p4", name: "Jagadamba Steel", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p5", name: "Litmus", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p6", name: "Sarvo", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p7", name: "Sika", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
    { _id: "p8", name: "Surya Ply", logo: { url: PLACEHOLDER_IMAGES.BRAND, publicId: "" } },
  ];

  const displayBrands = brands && brands.length > 0 ? brands : placeholderBrands;

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

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase">
            Trusted Brands
          </h2>
        </div>

        {/* Brands Carousel */}
        <div className="relative">
          <button
            onClick={scrollPrev}
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          <div className="overflow-hidden mx-6 md:mx-10" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {displayBrands.map((brand) => (
                <div
                  key={brand._id || brand.name}
                  className="flex-none w-36 md:w-44"
                >
                  <div className="bg-white rounded-xl p-4 md:p-5 h-28 md:h-32 flex items-center justify-center border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                    <CloudinaryImage
                      src={brand.logo?.url || PLACEHOLDER_IMAGES.BRAND}
                      publicId={brand.logo?.publicId}
                      alt={brand.name}
                      width={100}
                      height={50}
                      className="object-contain max-h-16 md:max-h-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
