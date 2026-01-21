"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
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
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-primary-200 to-primary-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-red-200 to-red-100 rounded-full blur-[120px]" />
      </div>

      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-bold capitalize tracking-wider mb-4 border border-primary-100/50">
            {/* <Star className="w-4 h-4 fill-primary-700" /> */}
            Client Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Trusted Hardware Partner
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
            From professional contractors to DIY enthusiasts, see why Root Suppliers is the preferred choice for quality tools and materials.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Buttons (Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 w-14 h-14 rounded-full bg-white shadow-xl border border-gray-100 text-gray-700 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 w-14 h-14 rounded-full bg-white shadow-xl border border-gray-100 text-gray-700 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6 py-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-white rounded-3xl p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-gray-200/50 hover:border-primary-200 transition-all duration-500 flex flex-col group relative hover:-translate-y-2"
                  >
                    {/* Decorative Quotation Mark */}
                    <div className="absolute top-6 right-8 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500">
                      <Quote className="w-20 h-20 text-primary-600" />
                    </div>
                    {/* Gradient Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-red-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-6 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-100 text-gray-100"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <div className="flex-grow mb-8 relative z-10">
                      <p className="text-gray-700 leading-relaxed text-base font-normal">
                        "{testimonial.reviewText}"
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary-100 group-hover:ring-primary-200 transition-all">
                        {testimonial.customerImage?.url ? (
                          <CloudinaryImage
                            src={testimonial.customerImage.url}
                            alt={testimonial.customerName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg">
                            {(testimonial.customerName || "A").charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                          {testimonial.customerName}
                        </h4>
                        {testimonial.customerDesignation && (
                          <p className="text-sm text-gray-500 font-medium">
                            {testimonial.customerDesignation}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                  ? "w-8 bg-primary-600"
                  : "w-2 bg-gray-300 hover:bg-primary-300"
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
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials(FALLBACK_TESTIMONIALS);
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

  return <TestimonialsSection testimonials={testimonials} />;
};

export default TestimonialsSection;
