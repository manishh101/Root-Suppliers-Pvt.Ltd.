"use client";

import React, { useEffect, useState, useRef } from "react";
import { Package, Users, Award, Calendar } from "lucide-react";
import { DEFAULT_STATS } from "@/lib/constants";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Package, value: 1000, suffix: "+", label: "Products" },
  { icon: Users, value: 500, suffix: "+", label: "Happy Customers" },
  { icon: Award, value: 50, suffix: "+", label: "Trusted Brands" },
  { icon: Calendar, value: 15, suffix: "+", label: "Years Experience" },
];

// Animated counter hook
function useCountUp(end: number, isVisible: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, isVisible, duration]);

  return count;
}

const StatCard: React.FC<{ stat: StatItem; isVisible: boolean; isLast?: boolean }> = ({ stat, isVisible, isLast }) => {
  const count = useCountUp(stat.value, isVisible);
  const IconComponent = stat.icon;

  return (
    <div className="text-center relative group">
      {/* Gradient Icon Circle */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-primary-600">
        {count}
        <span className="text-primary-600">{stat.suffix}</span>
      </div>
      <div className="text-gray-600 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>

      {/* Vertical Divider (hidden on last item and mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
      )}
    </div>
  );
};

interface StatsSectionProps {
  stats?: {
    label: string;
    value: number;
    suffix?: string;
    icon?: React.ElementType; // Optional if we map icons later or pass them
  }[];
}

// Map labels to icons if needed, or just use generic ones
const getIcon = (label: string) => {
  if (label.toLowerCase().includes("product")) return Package;
  if (label.toLowerCase().includes("customer") || label.toLowerCase().includes("client")) return Users;
  if (label.toLowerCase().includes("brand")) return Award;
  if (label.toLowerCase().includes("year") || label.toLowerCase().includes("experience")) return Calendar;
  return Award;
};

export const StatsSection: React.FC<StatsSectionProps> = ({ stats: customStats }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Default stats fallback - only use if customStats is undefined
  const displayStats = customStats !== undefined ? customStats : DEFAULT_STATS;

  if (!displayStats || displayStats.length === 0) {
    return null;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-main relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">By The Numbers</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {displayStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={{ ...stat, icon: getIcon(stat.label), suffix: stat.suffix || "+" }}
              isVisible={isVisible}
              isLast={index === displayStats.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
