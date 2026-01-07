"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Truck,
  Shield,
  ArrowRight,
  Phone,
} from "lucide-react";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTASection } from "@/components/sections/CTASection";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We prioritize our customers' needs and strive to exceed their expectations in every interaction.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description:
      "We are committed to sourcing and providing only the highest quality products that meet industry standards.",
  },
  {
    icon: Users,
    title: "Integrity",
    description:
      "We conduct our business with honesty, transparency, and ethical practices at all times.",
  },
  {
    icon: Shield,
    title: "Reliability",
    description:
      "We ensure consistent service quality and product availability to support your projects.",
  },
];

const milestones = [
  { year: "2010", title: "Founded", description: "Root Suppliers was established in Biratnagar" },
  { year: "2013", title: "Expanded", description: "Moved to a larger warehouse facility" },
  { year: "2016", title: "500+ Products", description: "Expanded product catalog significantly" },
  { year: "2019", title: "1000+ Products", description: "Became a one-stop construction shop" },
  { year: "2023", title: "Digital Transformation", description: "Launched online presence" },
  { year: "2024", title: "50+ Brands", description: "Partnered with leading manufacturers" },
];

const team = [
  {
    name: "Rajesh Sharma",
    role: "Founder & CEO",
    image: "/images/team/ceo.jpg",
  },
  {
    name: "Sunita Agarwal",
    role: "Operations Manager",
    image: "/images/team/operations.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Sales Head",
    image: "/images/team/sales.jpg",
  },
  {
    name: "Priya Thapa",
    role: "Customer Relations",
    image: "/images/team/customer.jpg",
  },
];

export default function AboutPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-secondary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium mb-6"
            >
              About Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-primary font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Building Trust Since{" "}
              <span className="text-primary-400">2010</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Root Suppliers Pvt. Ltd. has been serving the construction and hardware 
              needs of Biratnagar and the surrounding region with quality products 
              and exceptional service.
            </motion.p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container-main mt-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </nav>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/store-interior.jpg"
                  alt="Root Suppliers Store Interior"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-primary-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <span className="block text-4xl font-bold">15+</span>
                  <span className="text-primary-100 text-sm">Years</span>
                </div>
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-100 rounded-2xl -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="font-primary font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                From Humble Beginnings to Industry Leaders
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Root Suppliers Pvt. Ltd. was founded in 2010 with a simple mission: 
                  to provide quality construction materials and hardware to the growing 
                  community of Biratnagar and the surrounding region.
                </p>
                <p>
                  What started as a small shop has now grown into one of the most trusted 
                  hardware suppliers in the region. Our commitment to quality, fair pricing, 
                  and exceptional customer service has earned us the trust of over 500 
                  contractors, builders, and homeowners.
                </p>
                <p>
                  Today, we offer over 1000 products from 50+ trusted brands, making us 
                  your one-stop destination for all construction and hardware needs. Our 
                  knowledgeable team is always ready to help you find the right solutions 
                  for your projects.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-card"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="font-primary font-bold text-2xl text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and preferred hardware and construction materials 
                partner in Eastern Nepal, known for our quality products, competitive 
                pricing, and exceptional customer service.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-card"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary-100 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="font-primary font-bold text-2xl text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide comprehensive construction solutions under one roof, empowering 
                our customers to build their dreams with confidence through quality products, 
                expert guidance, and reliable service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4">
              What We Stand For
            </span>
            <h2 className="font-primary font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These values guide everything we do and define who we are as a company.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center mb-5">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-xl text-gray-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="font-primary font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Milestones & Achievements
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} pl-12 md:pl-0`}>
                  <div className="bg-white rounded-xl p-6 shadow-card">
                    <span className="text-primary-600 font-bold text-lg">
                      {milestone.year}
                    </span>
                    <h4 className="font-semibold text-gray-900 mt-1">
                      {milestone.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow md:-translate-x-1/2" />

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="font-primary font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                Your Success is Our Priority
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We go above and beyond to ensure our customers have access to the 
                best products and services for their construction needs.
              </p>

              <ul className="space-y-4">
                {[
                  "Extensive product catalog with 1000+ items",
                  "Competitive pricing with bulk discounts",
                  "Expert guidance from experienced staff",
                  "Reliable delivery across the region",
                  "After-sales support and warranty assistance",
                  "Flexible payment options available",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors group"
              >
                Get in Touch
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/images/about/warehouse-1.jpg"
                      alt="Our Warehouse"
                      width={280}
                      height={320}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/images/about/products-1.jpg"
                      alt="Our Products"
                      width={280}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/images/about/team-1.jpg"
                      alt="Our Team"
                      width={280}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/images/about/delivery-1.jpg"
                      alt="Delivery Service"
                      width={280}
                      height={320}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
