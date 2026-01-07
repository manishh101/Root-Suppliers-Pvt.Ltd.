"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/categories", label: "CATEGORIES" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/contact", label: "CONTACT US" },
  { href: "/about", label: "ABOUT US" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container-main py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Root Suppliers Pvt. Ltd."
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </Link>

            {/* Tagline - Center */}
            <div className="hidden md:block text-center">
              <p className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-wide">
                ALL CONSTRUCTION
              </p>
              <p className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-wide">
                SOLUTIONS UNDER ONE
              </p>
              <p className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-wide">
                ROOF
              </p>
            </div>

            {/* Contact Info - Right */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-gray-900">9851222637</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">pulchowk, kharji chowk</span>
              </div>
              <a
                href="https://maps.google.com/?q=Root+Suppliers+Biratnagar"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors"
              >
                Get Directions
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-main">
          <div className="flex items-center justify-between py-2">
            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 md:flex-none md:w-72 md:ml-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="container-main py-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-gray-700 hover:text-primary-600 py-2 border-b border-gray-100 uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-600" />
                <a href="tel:+9779851222637" className="text-sm text-gray-700">9851222637</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">pulchowk, kharji chowk</span>
              </div>
              <a
                href="https://maps.google.com"
                className="inline-block px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
