"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "CATEGORIES", href: "/categories" },
  { label: "BLOGS", href: "/blogs" },
  { label: "CONTACT US", href: "/contact" },
  { label: "ABOUT US", href: "/about" },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white py-3"
      )}
    >
      <div className="container-main">
        {/* Top Section - Logo, Tagline, Contact */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Root Suppliers Pvt. Ltd."
                width={70}
                height={70}
                className="h-16 w-auto"
              />
            </Link>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                All Construction
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                Solutions Under One
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                Roof
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+9779812345678"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="h-4 w-4 text-primary-600" />
              <span className="font-medium">9851225827</span>
            </a>
            <div className="flex flex-col text-sm text-gray-600">
              <a
                href="mailto:info@rootsuppliers.com.np"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-4 w-4 text-primary-600" />
                <span>info@rootsuppliers.com</span>
              </a>
              <span className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span>Biratnagar, Nepal 56600</span>
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-3">
          {/* Nav Links */}
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                      isActive
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-64 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container-main py-4">
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Nav Links */}
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3 text-sm font-semibold uppercase tracking-wide rounded-lg transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-600"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <a
                  href="tel:+9779851225827"
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <Phone className="h-4 w-4 text-primary-600" />
                  <span>9851225827</span>
                </a>
                <a
                  href="mailto:info@rootsuppliers.com.np"
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <Mail className="h-4 w-4 text-primary-600" />
                  <span>info@rootsuppliers.com</span>
                </a>
                <span className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  <span>Biratnagar, Nepal 56600</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
