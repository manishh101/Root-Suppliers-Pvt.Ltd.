"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProductCard } from "@/components/cards/ProductCard";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  Target,
  Eye,
  Sparkles
} from "lucide-react";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

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
    establishedYear?: string;
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
          publicId?: string;
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
  customerImage?: { url: string; publicId?: string };
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
  const heroImage = settings?.homepage?.about?.heroImage?.url || PLACEHOLDER_IMAGES.HERO;
  const heroImagePublicId = settings?.homepage?.about?.heroImage?.publicId;

  const storyTitle = settings?.homepage?.about?.story?.title || "More Than Just a Hardware Store.";
  const storyContent = settings?.homepage?.about?.story?.content
    ? `<p>${settings.homepage.about.story.content}</p>`
    : `<p><strong class="text-gray-900 font-semibold">Root Suppliers Pvt. Ltd.</strong> isn't just about selling tools; it's about enabling dreams. Established in 2010 in the heart of Biratnagar, we started with a simple vision: to bring world-class construction materials to our local community.</p>
       <p>What began as a modest storefront has blossomed into a trusted institution. We've weathered market changes and expanded our horizons, but our core philosophy remains unchanged — <span class="italic text-primary-700">integrity in every transaction</span>.</p>
       <p>Today, we pride ourselves on being a partner in your progress. Whether you're building a family home or a commercial landmark, our team puts their expertise to work for you, ensuring you have the right materials at the right time.</p>`;

  const storyImage = settings?.homepage?.about?.story?.image?.url || PLACEHOLDER_IMAGES.HERO;
  const storyImagePublicId = settings?.homepage?.about?.story?.image?.publicId;

  const missionTitle = settings?.homepage?.about?.mission?.title || "Our Mission";
  const missionContent = settings?.homepage?.about?.mission?.content ||
    "To empower builders and homeowners by providing unmatched quality construction materials. We strive to simplify the complex supply chain, offering fair prices and expert guidance to ensure every structure built with our supplies stands the test of time.";

  const visionTitle = settings?.homepage?.about?.vision?.title || "Our Vision";
  const visionContent = settings?.homepage?.about?.vision?.content ||
    "To represent the gold standard in hardware supply across Nepal. We envision a future where Root Suppliers is synonymous with trust, innovation, and community development, helping shape the skyline of Biratnagar and beyond.";

  const statsData = settings?.homepage?.stats;

  const galleryImages = settings?.homepage?.about?.gallery || [];



  return (
    <div className="bg-white">
      {/* Hero Section - Enhanced with modern design */}
      <section className="relative py-16 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-100/40 to-primary-50/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-gradient-to-tr from-gray-100/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50/20 to-transparent rounded-full opacity-50" />

        <div className="container-main relative z-10">
          {/* Header Title - Centered with enhanced styling */}
          <div className="mb-16 md:mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-100 shadow-sm mb-6">
                {/* <Sparkles className="w-4 h-4 text-primary-500" /> */}
                <span className="text-xs font-semibold text-gray-700 font-secondary">Since {settings?.site?.establishedYear || "2010"}</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 md:mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">Root Suppliers</span>
              </h1>
              <div className="h-1.5 w-24 md:w-32 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto rounded-full" />
              <p className="text-gray-500 mt-4 md:mt-6 text-xs md:text-sm font-medium max-w-2xl mx-auto leading-relaxed font-secondary">
                Building the future of Eastern Nepal, one project at a time.
                <span className="text-primary-600 font-semibold"> All your construction solutions under one roof.</span>
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image - Enhanced with modern styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200/50">
                  <CloudinaryImage
                    src={storyImage}
                    publicId={storyImagePublicId}
                    alt="Root Suppliers Store"
                    fill
                    className="object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                </div>

                {/* Floating Badge - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    {/* <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-white" />
                    </div> */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-secondary">Established</p>
                      <p className="text-2xl font-extrabold text-gray-900">{settings?.site?.establishedYear || "2010"}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-primary-200/50 rounded-3xl hidden md:block" />
                <div className="absolute -z-20 top-12 -left-12 w-full h-full bg-primary-50/50 rounded-3xl hidden md:block" />
              </div>
            </motion.div>

            {/* Right Content - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-bold text-[10px] uppercase tracking-wider mb-6">
                {/* <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" /> */}
                Our Story
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {storyTitle}
              </h2>
              <div className="space-y-5 text-gray-600 text-sm md:text-base leading-relaxed font-secondary" dangerouslySetInnerHTML={{ __html: storyContent }} />

              {/* Key Points */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  "Premium Quality Materials",
                  "Expert Guidance",
                  "Competitive Pricing",
                  "Reliable Delivery"
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 font-secondary">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section - Enhanced Modern Design */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 font-semibold text-xs mb-6 font-secondary">
              {/* <Target className="w-4 h-4" /> */}
              Our Purpose
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Driven by <span className="text-primary-600">Purpose</span>
            </h2>
            <p className="text-gray-500 text-base font-secondary">Our guiding principles that define every interaction and decision we make.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Mission Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform opacity-10" />
              <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-full -mr-10 -mt-10" />

                <div className="relative z-10">
                  {/* <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div> */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{missionTitle}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base font-secondary">
                    {missionContent}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform opacity-10" />
              <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full -mr-10 -mt-10" />

                <div className="relative z-10">
                  {/* <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                    <Eye className="w-8 h-8 text-white" />
                  </div> */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{visionTitle}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base font-secondary">
                    {visionContent}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Masonry-style Grid - DYNAMIC GALLERY */}
      {galleryImages.length > 0 ? (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl" />

          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 font-semibold text-xs mb-4 font-secondary">
                  Our Gallery
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Inside Root Suppliers</h2>
              </div>
              <p className="text-gray-500 max-w-md md:text-right text-sm md:text-base font-secondary">
                A glimpse into our daily operations, vast inventory, and dedicated team working hard to serve you.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto">
              {/* Display gallery images dynamically */}
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden group min-h-[250px] ${idx === 0 ? 'md:col-span-8 md:row-span-2 md:h-[600px] h-[350px]' : 'md:col-span-4 h-[250px] md:h-[300px]'}`}
                >
                  <CloudinaryImage
                    src={img.url}
                    publicId={img.publicId}
                    alt={img.alt || "Gallery Image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl" />

          <div className="container-main relative z-10">
            {/* Static Fallback Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 font-semibold text-xs mb-4 font-secondary">
                  Our Gallery
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Inside Root Suppliers</h2>
              </div>
              <p className="text-gray-500 max-w-md md:text-right text-sm md:text-base font-secondary">
                A glimpse into our daily operations, vast inventory, and dedicated team.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[600px]">
              {/* Left Column - Large feature */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-7 h-[350px] md:h-full relative rounded-2xl overflow-hidden group"
              >
                <CloudinaryImage
                  src={PLACEHOLDER_IMAGES.HERO}
                  alt="Warehouse Operations"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="font-bold text-lg mb-1">Extensive Inventory</p>
                  <p className="text-xs text-white/80 font-secondary">Everything you need, always in stock.</p>
                </div>
              </motion.div>

              {/* Right Column - Stacked */}
              <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 relative rounded-2xl overflow-hidden group min-h-[200px] md:min-h-0 h-[250px] md:h-auto"
                >
                  <CloudinaryImage
                    src={PLACEHOLDER_IMAGES.PRODUCT}
                    alt="Safety Gear"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 relative rounded-2xl overflow-hidden group min-h-[200px] md:min-h-0 h-[250px] md:h-auto"
                >
                  <CloudinaryImage
                    src={PLACEHOLDER_IMAGES.PRODUCT}
                    alt="Quality Tools"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section - Enhanced wrapper */}
      <div className="border-y border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <StatsSection stats={statsData} />
      </div>

      {/* Testimonials Section - Enhanced */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}

        {/* Call to Action Buttons - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pb-8"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-bold hover:from-primary-500 hover:to-primary-600 transition-all shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:-translate-y-1"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-full font-bold hover:border-primary-300 hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Featured Products - Enhanced Clean Design */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/30 rounded-full blur-3xl" />

          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16 gap-6"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-gray-600 font-semibold text-xs mb-4 shadow-sm font-secondary">
                  ✨ Featured
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Curated Selection
                </h2>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-bold rounded-full shadow-md hover:shadow-lg transition-all border border-primary-100 hover:border-primary-300"
              >
                Browse Full Catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto">
                <p className="text-gray-600 mb-6 text-base font-secondary">
                  Can&apos;t find what you&apos;re looking for? We have thousands more items in store.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Contact Our Sales Team
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
