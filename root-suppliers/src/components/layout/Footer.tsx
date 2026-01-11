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
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Contact", href: "/contact" },
];

const productCategories = [
  { label: "Paints & Coatings", href: "/categories/paints-and-coatings" },
  { label: "Tools & Hardware", href: "/categories/tools-and-hardware" },
  { label: "Plumbing Supplies", href: "/categories/plumbing-supplies" },
  { label: "Electrical Items", href: "/categories/electrical-items" },
  { label: "Construction Materials", href: "/categories/construction-materials" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-secondary-700 via-secondary-800 to-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container-main py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20">
                <Image
                  src="/images/logo.png"
                  alt="Root Suppliers"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <span className="font-semibold text-lg text-white block tracking-tight">
                  Root Suppliers
                </span>
                <span className="text-secondary-200 text-xs">Pvt. Ltd.</span>
              </div>
            </Link>
            <p className="text-secondary-200 text-sm mb-6 leading-relaxed">
              All Construction Solutions Under One Roof. Your trusted hardware partner in Biratnagar since 2010.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white hover:text-secondary-700 transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-secondary-200 group-hover:text-secondary-700 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-5">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {productCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://maps.app.goo.gl/rJiwFYqFo3Dku59LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-secondary-200 hover:text-white text-sm transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary-300" />
                  <span>
                    Main Road, Biratnagar-4
                    <br />
                    Morang, Nepal
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+9779851235637"
                  className="flex items-center gap-3 text-secondary-200 hover:text-white text-sm transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-secondary-300" />
                  <span>9851235637</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@rootsuppliers.com"
                  className="flex items-center gap-3 text-secondary-200 hover:text-white text-sm transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-secondary-300" />
                  <span>info@rootsuppliers.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-secondary-200 text-sm">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary-300" />
                <div>
                  <span className="block">Sun - Fri: 7AM - 7PM</span>
                  <span className="block">Saturday: 7AM - 5PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700/50">
        <div className="container-main py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-secondary-300 text-xs">
            <p>
              © {currentYear} Root Suppliers Pvt. Ltd.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-secondary-500">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
