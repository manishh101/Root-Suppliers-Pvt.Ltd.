"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const productCategories = [
  { label: "Paints & Coatings", href: "/categories/paints" },
  { label: "Tools & Hardware", href: "/categories/tools" },
  { label: "Plumbing Supplies", href: "/categories/plumbing" },
  { label: "Electrical Items", href: "/categories/electrical" },
  { label: "Construction Materials", href: "/categories/construction" },
  { label: "Safety Equipment", href: "/categories/safety" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="container-main py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-primary font-bold text-2xl mb-2">
                Stay Updated with Latest Products
              </h3>
              <p className="text-primary-100">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/10">
                <Image
                  src="/images/logo.png"
                  alt="Root Suppliers"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <span className="font-primary font-bold text-xl block">
                  Root Suppliers
                </span>
                <span className="text-gray-400 text-sm">Pvt. Ltd.</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              All Construction Solutions Under One Roof. Your trusted hardware
              partner in Biratnagar, Nepal, serving the community since 2010.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-6 text-white">
              Categories
            </h4>
            <ul className="space-y-3">
              {productCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-6 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-500" />
                  <span>
                    Main Road, Biratnagar-4
                    <br />
                    Morang, Nepal
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+977-XXX-XXXXXXX"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary-500" />
                  <span>+977-XXX-XXXXXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@rootsuppliers.com.np"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0 text-primary-500" />
                  <span>info@rootsuppliers.com.np</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-500" />
                <div>
                  <span className="block">Sun - Fri: 7:00 AM - 7:00 PM</span>
                  <span className="block">Saturday: 7:00 AM - 5:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>
              © {currentYear} Root Suppliers Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
            <p>
              Made with ❤️ in Nepal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
