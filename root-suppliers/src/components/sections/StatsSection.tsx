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

const StatCard: React.FC<{ stat: StatItem; isVisible: boolean }> = ({ stat, isVisible }) => {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {count}
        <span className="text-primary-600">{stat.suffix}</span>
      </div>
      <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
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
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {displayStats.map((stat) => (
            <StatCard
              key={stat.label}
              stat={{ ...stat, icon: getIcon(stat.label), suffix: stat.suffix || "+" }}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
