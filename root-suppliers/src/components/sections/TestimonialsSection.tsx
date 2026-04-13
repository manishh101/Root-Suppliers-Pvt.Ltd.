"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  _id: string;
  customerName: string;
  customerDesignation?: string;
  customerImage?: { url: string };
  reviewText: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
            What Our Customers Say
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-xs md:text-sm">
            Trusted by contractors and homeowners across Nepal.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation */}
          <div className="hidden md:block">
            <button
              onClick={scrollPrev}
              className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
                >
                  <div className="h-full bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col">
                    {/* Rating */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm flex-grow mb-6">
                      "{testimonial.reviewText}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        {testimonial.customerImage?.url ? (
                          <CloudinaryImage
                            src={testimonial.customerImage.url}
                            alt={testimonial.customerName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-semibold text-sm">
                            {(testimonial.customerName || "A").charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs">
                          {testimonial.customerName}
                        </h4>
                        {testimonial.customerDesignation && (
                          <p className="text-[10px] text-gray-400">
                            {testimonial.customerDesignation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-200 ${index === selectedIndex
                  ? "w-6 bg-gray-900"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSectionStatic: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials?isActive=true&limit=10"); // Increased limit for better carousel
        const data = await res.json();
        if (data.success && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    // Show a skeleton or loading state to prevent layout shift
    return <div className="py-24 bg-gray-50 h-[600px] animate-pulse"></div>;
  }

  if (testimonials.length === 0) return null;

  return <TestimonialsSection testimonials={testimonials} />;
};

export default TestimonialsSection;
