"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Award, 
  Users, 
  Truck, 
  Shield,
  Package,
  Clock
} from "lucide-react";

const whyChooseUs = [
  {
    icon: Award,
    title: "Quality Products",
    description: "Premium construction materials from trusted brands",
  },
  {
    icon: Package,
    title: "Wide Selection",
    description: "1000+ products under one roof",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Knowledgeable staff to assist you",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery service",
  },
  {
    icon: Shield,
    title: "Warranty Support",
    description: "Comprehensive warranty assistance",
  },
  {
    icon: Clock,
    title: "15+ Years",
    description: "Trusted experience since 2010",
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Who Are We - Left Side */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/images/logo.png"
                alt="Root Suppliers Pvt. Ltd."
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  Who Are We?
                </h2>
                <div className="w-16 h-1 bg-primary-600 mt-2" />
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              Root Suppliers Pvt. Ltd. is a leading construction materials and hardware 
              supplier based in Biratnagar, Nepal. Since 2010, we have been serving 
              contractors, builders, and homeowners with premium quality products.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our tagline &quot;All Construction Solutions Under One Roof&quot; reflects our 
              commitment to being your one-stop destination for all construction needs. 
              From steel and cement to paints and plumbing supplies, we have it all.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors group"
            >
              Learn More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Why Choose Us - Right Side */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Why Choose Us?
              </h2>
              <div className="w-16 h-1 bg-primary-600 mx-auto mt-2" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-3">
                    <item.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.description}</p>
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
