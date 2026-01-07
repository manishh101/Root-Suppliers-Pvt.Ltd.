"use client";

import React, { useEffect, useState, useRef } from "react";
import { Package, Users, Award, Calendar } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Package, value: 1000, suffix: "+", label: "Products Available" },
  { icon: Users, value: 500, suffix: "+", label: "Happy Customers" },
  { icon: Award, value: 50, suffix: "+", label: "Trusted Brands" },
  { icon: Calendar, value: 15, suffix: "+", label: "Years Experience" },
];

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} className="py-16 bg-secondary-700">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {isVisible ? stat.value : 0}{stat.suffix}
              </div>
              <div className="text-secondary-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
