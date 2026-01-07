"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  role?: string;
  image?: { url: string };
  content: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
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
    <section className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Customer Testimonials
          </h2>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="bg-white rounded-xl p-8 shadow-md text-center">
                    <Quote className="h-8 w-8 text-primary-200 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {testimonial.image?.url ? (
                          <Image
                            src={testimonial.image.url}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        {(testimonial.role || testimonial.company) && (
                          <p className="text-sm text-gray-500">
                            {testimonial.role}{testimonial.role && testimonial.company && ", "}{testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex ? "bg-primary-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSectionStatic: React.FC = () => {
  const placeholderTestimonials = [
    {
      _id: "1",
      name: "Ramesh Kumar",
      role: "Contractor",
      company: "Kumar Construction",
      content: "Root Suppliers has been our go-to hardware store for over 5 years. Their quality products and reliable service have made our projects successful.",
      rating: 5,
    },
    {
      _id: "2",
      name: "Sita Sharma",
      role: "Homeowner",
      content: "Excellent service and great prices. The staff is very helpful and knowledgeable. Highly recommended!",
      rating: 5,
    },
    {
      _id: "3",
      name: "Bikash Thapa",
      role: "Builder",
      company: "Thapa Builders",
      content: "One-stop shop for all construction needs. The variety of products and brands available is impressive.",
      rating: 4,
    },
  ];

  return <TestimonialsSection testimonials={placeholderTestimonials} />;
};

export default TestimonialsSection;
