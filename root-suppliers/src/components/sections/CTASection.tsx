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
      className="py-20 relative overflow-hidden"
    >
      {/* Gradient Background - Deep Navy Blue for Modern Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Floating decorative icons */}
        <div className="absolute top-20 left-[15%] text-white/10 animate-bounce" style={{ animationDuration: '3s' }}>
          <Hammer className="w-16 h-16" />
        </div>
        <div className="absolute bottom-20 right-[15%] text-white/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Wrench className="w-14 h-14" />
        </div>
        <div className="absolute top-1/3 right-[10%] text-white/10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <PaintBucket className="w-12 h-12" />
        </div>
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-main relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-bold rounded-full mb-6 capitalize tracking-wider border border-primary-100">
            Your One-Stop Hardware Shop
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Need Quality Hardware & <br className="hidden md:block" />Construction Materials?
          </h2>

          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Visit our store or give us a call. We have everything you need under one roof — from tools and paints to steel and cement.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Pulse glow effect */}
              <div className="absolute inset-0 rounded-xl bg-primary-400/50 animate-pulse opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300" />
              {/* <ShoppingBag className="h-5 w-5 relative z-10" /> */}
              <span className="relative z-10">Browse Products</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <a
              href={`tel:${settings?.contact?.primaryPhone || "9851235637"}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white hover:text-primary-700 transition-all duration-300 backdrop-blur-sm group"
            >
              {/* <Phone className="h-5 w-5" /> */}
              Call: {settings?.contact?.primaryPhone || "9851235637"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


