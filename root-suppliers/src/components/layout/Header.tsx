"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Menu, X, Search, Loader2 } from "lucide-react";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/products", label: "PRODUCTS" },
  { href: "/categories", label: "CATEGORIES" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/contact", label: "CONTACT US" },
  { href: "/about", label: "ABOUT US" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
          const data = await res.json();
          if (data.success) {
            setSuggestions(data.products || []);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="container-main py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/images/logo.png"
                alt="Root Suppliers Pvt. Ltd."
                width={90}
                height={90}
                className="w-20 md:w-24 h-20 md:h-24 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Tagline - Center */}
            <div className="hidden lg:block text-center flex-1">
              <h2 className="text-base lg:text-lg font-extrabold text-gray-900 uppercase tracking-wider leading-tight">
                ALL CONSTRUCTION
              </h2>
              <p className="text-base lg:text-lg font-extrabold bg-gradient-to-r from-primary-600 to-red-600 bg-clip-text text-transparent uppercase tracking-wider">
                SOLUTIONS UNDER ONE ROOF
              </p>
            </div>

            {/* Contact Info - Right */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 group">
                <div className="p-2 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors">
                  <Phone className="h-4 w-4 text-primary-600" />
                </div>
                <a href="tel:+9779851222637" className="text-sm font-bold text-gray-900 hover:text-secondary-600 transition-colors">
                  9851222637
                </a>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <div className="p-2 rounded-full bg-red-50">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Pulchowk, Kharji Chowk</span>
              </div>
              <a
                href="https://maps.app.goo.gl/rJiwFYqFo3Dku59LA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg hover:scale-105 duration-300"
              >
                Get Directions
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="hidden md:block bg-gradient-to-r from-primary-600 via-primary-600 to-red-600">
        <div className="container-main">
          <div className="flex items-center justify-between py-3">
            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 lg:px-4 py-2 text-sm font-bold text-white hover:text-white hover:bg-secondary-700/50 rounded-lg transition-all duration-300 uppercase tracking-wide hover:scale-105"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:block md:w-64 lg:w-80" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  className="w-full px-4 py-2.5 pr-10 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-sm"
                />
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-secondary-600 hover:text-secondary-700 bg-secondary-50 rounded-md hover:bg-secondary-100 transition-colors"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {suggestions.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 transition-colors group"
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            {product.images?.[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Search className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-secondary-600 transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {product.category?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-secondary-600">
                              NPR {product.price.toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={() => handleSearch()}
                        className="w-full px-4 py-2 text-xs font-bold text-gray-500 hover:text-secondary-600 bg-gray-50 hover:bg-secondary-50/50 transition-colors text-center border-t border-gray-100 mt-1"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="container-main py-4">
            {/* Mobile Search */}
            <div className="relative mb-4" ref={mobileSearchRef}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-600 bg-primary-50 rounded-md"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>

              {/* Mobile Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                  <div className="py-2">
                    {suggestions.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 border-b border-gray-50 last:border-0"
                      >
                        <div className="relative w-10 h-10 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                          {product.images?.[0]?.url && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-primary-600">
                            NPR {product.price.toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-3 px-4 rounded-lg transition-all uppercase border-b border-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-primary-100">
                  <Phone className="h-4 w-4 text-primary-600" />
                </div>
                <a href="tel:+9779851222637" className="text-sm font-bold text-gray-900">9851222637</a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-red-100">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Pulchowk, Kharji Chowk</span>
              </div>
              <a
                href="https://maps.app.goo.gl/rJiwFYqFo3Dku59LA"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
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
