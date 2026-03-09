"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, ShoppingBag, Hammer, Wrench, PaintBucket } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export const CTASection: React.FC = () => {
  const { settings } = useSettings();
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

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 relative bg-secondary-600"
    >
      <div className="container-main relative z-10">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Ready to Start Your Project?
          </h2>

          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light">
            Explore our complete range of construction materials and hardware supplies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${settings?.contact?.primaryPhone || "9851235637"}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <Phone className="h-5 w-5" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


