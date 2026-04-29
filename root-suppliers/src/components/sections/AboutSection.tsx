"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  Warehouse,
  Timer,
  ShieldCheck,
  CalendarCheck
} from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { useSettings } from "@/contexts/SettingsContext";

export const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  const whyChooseUs = [
    {
      icon: BadgeCheck,
      title: "Quality Products",
      description: "Premium construction materials from trusted brands",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      icon: Warehouse,
      title: "Wide Selection",
      description: "1000+ products under one roof",
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
    },
    {
      icon: Headphones,
      title: "Expert Guidance",
      description: "Knowledgeable staff to assist you",
      color: "from-violet-500 to-violet-600",
      bgLight: "bg-violet-50",
    },
    {
      icon: Timer,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service",
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      icon: ShieldCheck,
      title: "Warranty Support",
      description: "Comprehensive warranty assistance",
      color: "from-cyan-500 to-cyan-600",
      bgLight: "bg-cyan-50",
    },
    {
      icon: CalendarCheck,
      title: `${new Date().getFullYear() - parseInt(settings?.site?.establishedYear || "2010")}+ Years`,
      description: `Trusted experience since ${settings?.site?.establishedYear || "2010"}`,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-50",
    },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Who Are We - Left Side */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <CloudinaryImage
                src={settings?.site?.logo?.url || "/images/logo.png"}
                alt={settings?.site?.name || "Root Suppliers Pvt. Ltd."}
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Who Are We?
                </h2>
                <div className="w-16 h-1 bg-primary-600 mt-2" />
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
              {settings?.site?.name || "Root Suppliers"} Pvt. Ltd. is a leading construction materials and hardware
              supplier based in Biratnagar, Nepal. Since {settings?.site?.establishedYear || "2010"}, we have been serving
              contractors, builders, and homeowners with premium quality products.
            </p>
            {settings?.site?.tagline !== "" && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                Our tagline &quot;{settings?.site?.tagline || "All Construction Solutions Under One Roof"}&quot; reflects our
                commitment to being your one-stop destination for all construction needs.
                From steel and cement to paints and plumbing supplies, we have it all.
              </p>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-bold text-[11px] md:text-xs tracking-widest uppercase rounded-lg hover:bg-primary-700 transition-colors group font-primary"
            >
              Learn More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Why Choose Us - Right Side */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide">
                Why Choose Us?
              </h2>
              <div className="w-16 h-1 bg-primary-600 mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle background gradient on hover */}
                  <div className={`absolute inset-0 ${item.bgLight} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  
                  {/* Icon container with gradient */}
                  <div className={`relative z-10 w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <item.icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */ }
                  <h4 className="relative z-10 font-semibold text-gray-800 text-sm mb-2 font-secondary tracking-normal">
                    {item.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="relative z-10 text-xs text-gray-500 leading-relaxed font-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
