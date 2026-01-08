"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProductCard } from "@/components/cards/ProductCard";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Package, Users, Award, Calendar, Loader2 } from "lucide-react";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";

// Real product data structure using existing images
const featuredProducts = [
  {
    _id: "1",
    name: "Premium Power Drill Set",
    slug: "power-drill-set",
    description: "High-performance cordless drill for professional construction use.",
    shortDescription: "Professional grade cordless drill.",
    images: ["/images/products/image.png"],
    category: { _id: "cat1", name: "Power Tools", slug: "power-tools" },
    isActive: true,
  },
  {
    _id: "2",
    name: "Industrial Safety Helmet",
    slug: "safety-helmet",
    description: "Standard compliant safety helmet for construction sites.",
    shortDescription: "ANSI certified safety helmet.",
    images: ["/images/products/image copy.png"],
    category: { _id: "cat2", name: "Safety Gear", slug: "safety-gear" },
    isActive: true,
  },
  {
    _id: "3",
    name: "Plumbing Pipe Fittings",
    slug: "pipe-fittings",
    description: "Durable PVC pipe fittings for residential plumbing.",
    shortDescription: "Durable PVC fittings.",
    images: ["/images/products/image copy 2.png"],
    category: { _id: "cat3", name: "Plumbing", slug: "plumbing" },
    isActive: true,
  },
  {
    _id: "4",
    name: "Electrical Switchgear",
    slug: "electrical-switch",
    description: "Safe and reliable electrical switches for home wiring.",
    shortDescription: "Premium electrical switches.",
    images: ["/images/products/image copy 3.png"],
    category: { _id: "cat4", name: "Electrical", slug: "electrical" },
    isActive: true,
  },
];

interface SettingsData {
  site: {
    name: string;
    description: string;
  };
  homepage: {
    stats: {
      label: string;
      value: number;
      suffix?: string;
    }[];
    about?: {
      heroImage?: {
        url: string;
        publicId?: string;
        alt?: string;
      };
      story: {
        title: string;
        content: string;
        image?: {
          url: string;
        };
      };
      mission: {
        title: string;
        content: string;
      };
      vision: {
        title: string;
        content: string;
      };
      gallery?: {
        url: string;
        publicId?: string;
        alt?: string;
      }[];
      featuredProductIds?: string[];
    };
  };
}

interface Testimonial {
  _id: string;
  customerName: string;
  customerDesignation?: string;
  customerImage?: { url: string };
  reviewText: string;
  rating: number;
}

export default function AboutPageContent() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]); // Use appropriate type if available
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, testimonialsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/testimonials?isActive=true&limit=5")
        ]);

        const settingsData = await settingsRes.json();
        const testimonialsData = await testimonialsRes.json();

        if (settingsData.success) {
          setSettings(settingsData.settings);

          // Fetch featured products if IDs exist
          const ids = settingsData.settings?.homepage?.about?.featuredProductIds;
          if (ids && ids.length > 0) {
            const productsRes = await fetch(`/api/products?ids=${ids.join(',')}`);
            const productsData = await productsRes.json();
            if (productsData.success) {
              setFeaturedProducts(productsData.products);
            }
          }
        }
        if (testimonialsData.success) {
          setTestimonials(testimonialsData.testimonials);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  // Fallback defaults if settings are missing specific fields
  const heroImage = settings?.homepage?.about?.heroImage?.url || "/images/hero/image.png";

  const storyTitle = settings?.homepage?.about?.story?.title || "More Than Just a Hardware Store.";
  const storyContent = settings?.homepage?.about?.story?.content
    ? `<p>${settings.homepage.about.story.content}</p>`
    : `<p><strong class="text-gray-900 font-semibold">Root Suppliers Pvt. Ltd.</strong> isn't just about selling tools; it's about enabling dreams. Established in 2010 in the heart of Biratnagar, we started with a simple vision: to bring world-class construction materials to our local community.</p>
       <p>What began as a modest storefront has blossomed into a trusted institution. We've weathered market changes and expanded our horizons, but our core philosophy remains unchanged — <span class="italic text-primary-700">integrity in every transaction</span>.</p>
       <p>Today, we pride ourselves on being a partner in your progress. Whether you're building a family home or a commercial landmark, our team puts their expertise to work for you, ensuring you have the right materials at the right time.</p>`;

  const storyImage = settings?.homepage?.about?.story?.image?.url || "/images/hero/image.png";

  const missionTitle = settings?.homepage?.about?.mission?.title || "Our Mission";
  const missionContent = settings?.homepage?.about?.mission?.content ||
    "To empower builders and homeowners by providing unmatched quality construction materials. We strive to simplify the complex supply chain, offering fair prices and expert guidance to ensure every structure built with our supplies stands the test of time.";

  const visionTitle = settings?.homepage?.about?.vision?.title || "Our Vision";
  const visionContent = settings?.homepage?.about?.vision?.content ||
    "To represent the gold standard in hardware supply across Nepal. We envision a future where Root Suppliers is synonymous with trust, innovation, and community development, helping shape the skyline of Biratnagar and beyond.";

  const statsData = settings?.homepage?.stats?.length
    ? settings.homepage.stats
    : undefined;

  const galleryImages = settings?.homepage?.about?.gallery || [];

  const displayTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gray-50 rounded-full blur-3xl opacity-50 z-0" />

        <div className="container-main relative z-10">
          {/* Header Title */}
          <div className="mb-16 md:mb-24 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                ABOUT <span className="text-primary-600 block sm:inline">ROOT SUPPLIERS</span>
              </h1>
              <div className="h-1.5 w-24 bg-primary-600 mt-6 rounded-full mx-auto md:mx-0" />
              <p className="text-gray-500 mt-6 text-lg font-medium max-w-lg leading-relaxed">
                Building the future of Eastern Nepal, one project at a time. All your construction solutions under one roof.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Image - Overlapping Clean Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src={storyImage}
                  alt="Root Suppliers Store"
                  fill
                  className="object-cover"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-primary-600 max-w-[200px]">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Since</p>
                  <p className="text-3xl font-bold text-gray-900">2010</p>
                </div>
              </div>

              {/* Decorative Shape Behind */}
              <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-gray-100 rounded-2xl transform rotate-6 hidden md:block" />
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-700 font-bold text-xs uppercase tracking-widest mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-snug">
                {storyTitle}
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: storyContent }} />

              <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col sm:flex-row gap-8">
                {statsData ? statsData.slice(0, 3).map((stat, idx) => (
                  <div key={idx}>
                    <h4 className="text-2xl font-bold text-gray-900">{stat.value}{stat.suffix}</h4>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                )) : (
                  <>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">1000+</h4>
                      <p className="text-sm text-gray-500 mt-1">Premium Products</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">15+</h4>
                      <p className="text-sm text-gray-500 mt-1">Years Experience</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">5k+</h4>
                      <p className="text-sm text-gray-500 mt-1">Happy Clients</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section - Distinct Layout */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Driven by Purpose</h2>
            <p className="text-gray-600 text-lg">Our guiding principles that define every interaction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Mission Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🚀
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{missionTitle}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {missionContent}
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🔭
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{visionTitle}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {visionContent}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Masonry-style Grid - DYNAMIC GALLERY */}
      {galleryImages.length > 0 ? (
        <section className="py-24 bg-white">
          <div className="container-main">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <span className="text-primary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Gallery</span>
                <h2 className="text-3xl font-bold text-gray-900">Inside Root Suppliers</h2>
              </div>
              <p className="text-gray-500 max-w-sm text-right hidden md:block">
                A glimpse into our daily operations, vast inventory, and dedicated team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
              {/* Display gallery images dynamically - simple grid for generic length */}
              {galleryImages.map((img, idx) => (
                <div key={idx} className={`relative rounded-2xl overflow-hidden group min-h-[300px] ${idx === 0 ? 'md:col-span-8 md:row-span-2 h-[600px]' : 'md:col-span-4 h-[300px]'}`}>
                  <Image
                    src={img.url}
                    alt={img.alt || "Gallery Image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24 bg-white">
          <div className="container-main">
            {/* Static Fallback Gallery */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <span className="text-primary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Gallery</span>
                <h2 className="text-3xl font-bold text-gray-900">Inside Root Suppliers</h2>
              </div>
              <p className="text-gray-500 max-w-sm text-right hidden md:block">
                A glimpse into our daily operations, vast inventory, and dedicated team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
              {/* Left Column - Large feature */}
              <div className="md:col-span-7 h-[300px] md:h-full relative rounded-2xl overflow-hidden group">
                <Image
                  src="/images/hero/image copy.png"
                  alt="Warehouse Operations"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-lg">Extensive Inventory</p>
                  <p className="text-sm opacity-90">Everything you need, in stock.</p>
                </div>
              </div>

              {/* Right Column - Stacked */}
              <div className="md:col-span-5 flex flex-col gap-6 h-full">
                <div className="flex-1 relative rounded-2xl overflow-hidden group min-h-[200px]">
                  <Image
                    src="/images/products/image copy.png"
                    alt="Safety Gear"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="flex-1 relative rounded-2xl overflow-hidden group min-h-[200px]">
                  <Image
                    src="/images/products/image copy 2.png"
                    alt="Quality Tools"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <div className="border-y border-gray-100">
        <StatsSection stats={statsData} />
      </div>

      {/* Testimonials Section - NEW */}
      {/* Testimonials Section - NEW */}
      <div className="py-10">
        <TestimonialsSection testimonials={displayTestimonials} />

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pb-8">
          <Link
            href="/contact"
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Contact Us
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Browse Our Products
          </Link>
        </div>
      </div>

      {/* Featured Products - Clean & Minimal */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container-main">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                Curated Selection
              </h2>
              <Link
                href="/products"
                className="group flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Browse Full Catalog
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? We have thousands more items in store.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-xl shadow-gray-200"
              >
                Contact Our Sales Team
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
