import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

interface ITestimonial {
  _id: string;
  name: string;
  designation: string;
  company?: string;
  message: string;
  rating: number;
  image?: string;
  isActive: boolean;
}

export interface TestimonialCardProps {
  testimonial: ITestimonial;
}

/**
 * Testimonial Card Component
 * 
 * Displays customer testimonial in a card format.
 * Used in testimonial sections and homepage.
 * 
 * @example
 * ```tsx
 * <TestimonialCard testimonial={testimonialData} />
 * ```
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 flex flex-col h-full">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="h-10 w-10 text-primary-200" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < testimonial.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-gray-700 mb-6 flex-1 italic leading-relaxed">
        "{testimonial.message}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        {testimonial.image ? (
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold flex-shrink-0">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">
            {testimonial.designation}
            {testimonial.company && `, ${testimonial.company}`}
          </p>
        </div>
      </div>
    </div>
  );
};
