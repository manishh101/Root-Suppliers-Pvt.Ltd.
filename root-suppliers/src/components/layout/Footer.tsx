"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";
import { useSettings } from "@/contexts/SettingsContext";
import { useEffect, useState } from "react";

const quickLinks = [

  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];

// Dynamic categories will be fetched instead of hardcoded

import { formatBusinessHours } from "@/lib/formatBusinessHours";

export const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<{name: string; slug: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?limit=5&isActive=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.categories) {
            setCategories(data.categories.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Get social links from settings
  const socialLinks = [
    { icon: Facebook, href: settings?.social?.facebook, label: "Facebook" },
    { icon: Twitter, href: settings?.social?.twitter, label: "Twitter" },
    { icon: Instagram, href: settings?.social?.instagram, label: "Instagram" },
    { icon: Linkedin, href: settings?.social?.linkedin, label: "LinkedIn" },
    { icon: Youtube, href: settings?.social?.youtube, label: "YouTube" },
  ].filter(link => link.href && link.href.length > 0);

  const hours = formatBusinessHours(settings?.businessHours);

  return (
    <footer className="bg-secondary-600 text-white">
      {/* Main Footer */}
      <div className="container-main py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20">
                <CloudinaryImage
                  src={settings?.site?.logo?.url || "/images/logo.png"}
                  alt="Root Suppliers"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <span className="font-secondary font-bold text-lg text-white block tracking-tight capitalize">
                  Root Suppliers
                </span>
                <span className="text-secondary-200 text-xs font-semibold capitalize tracking-wider font-secondary">Pvt. Ltd.</span>
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
            <h4 className="font-semibold text-sm text-white capitalize mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-200 hover:text-white text-[11px] md:text-xs transition-colors !font-secondary uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-semibold text-sm text-white capitalize mb-5">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-secondary-200 hover:text-white text-[11px] md:text-xs transition-colors !font-secondary uppercase tracking-widest"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm text-white capitalize mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={settings?.contact?.googleMapsLink || "https://maps.app.goo.gl/jRWqSiE9fjLfv45r8"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 text-secondary-200 hover:text-white text-sm transition-colors font-secondary capitalize"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary-300" />
                  <span>
                    {settings?.contact?.address || "Main Road, Biratnagar-4, Morang, Nepal"}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings?.contact?.primaryPhone || "9851235637"}`}
                  className="flex items-center gap-3 text-secondary-200 hover:text-white text-sm transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-secondary-300" />
                  <span>{settings?.contact?.primaryPhone || "9851235637"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings?.contact?.primaryEmail || "info@rootsuppliers.com"}`}
                  className="flex items-center gap-3 text-secondary-200 hover:text-white text-sm transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-secondary-300" />
                  <span>{settings?.contact?.primaryEmail || "info@rootsuppliers.com"}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-secondary-200 text-sm">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary-300" />
                <div>
                  {hours.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700/50">
        <div className="container-main py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-white text-sm font-primary font-medium tracking-wider">
            <p>
              © {currentYear} Root Suppliers Pvt. Ltd.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white/80 transition-colors">
                Privacy
              </Link>
              <span className="text-white/60">·</span>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
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
