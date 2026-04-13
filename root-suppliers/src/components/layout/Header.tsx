"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, MapPin, Menu, X, Search, Loader2, Package } from "lucide-react";
import MobileCategoryMenu from "@/components/layout/MobileCategoryMenu";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";
import { useSettings } from "@/contexts/SettingsContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Header hide/show on scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show header when at top of page
          if (currentScrollY < 10) {
            setIsHeaderVisible(true);
          }
          // Hide when scrolling down, show when scrolling up
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsHeaderVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsHeaderVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Top Bar */}
        <div className="bg-white">
          <div className="container-main py-2 md:py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 group relative w-14 h-14 md:w-24 md:h-24 top-1 md:top-5">
                <CloudinaryImage
                  src={settings?.site?.logo?.url || "/images/logo.png"}
                  alt={settings?.site?.name || "Root Suppliers Pvt. Ltd."}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>

              {/* Tagline - Center */}
              <div className="hidden lg:block text-center flex-1 ml-8 lg:ml-12">
                <h2 className="text-base lg:text-lg font-bold text-gray-900 uppercase tracking-[0.1em] leading-tight font-primary">
                  All Construction
                </h2>
                <p className="text-base lg:text-lg font-bold bg-gradient-to-r from-primary-600 to-red-600 bg-clip-text text-transparent uppercase tracking-[0.1em] font-primary">
                  Solutions Under One Roof
                </p>
              </div>

              {/* Contact Info - Right */}
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary-600" />
                  </div>
                  <a href={`tel:${settings?.contact?.primaryPhone || '9851222637'}`} className="text-base font-bold text-gray-900 hover:text-secondary-600 transition-colors whitespace-nowrap">
                    {settings?.contact?.primaryPhone || '9851222637'}
                  </a>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  <div className="p-2 rounded-full bg-red-50">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-base text-gray-700 font-medium">{settings?.contact?.address || 'Pulchowk, Kharji Chowk'}</span>
                </div>
                <a
                  href={settings?.contact?.googleMapsLink || 'https://maps.app.goo.gl/jRWqSiE9fjLfv45r8'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:text-white text-sm font-bold rounded-full hover:from-primary-500 hover:to-primary-600 transition-all shadow-md hover:shadow-lg hover:scale-105 duration-300 font-primary"
                >
                  Get Directions
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors z-50 relative"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  {/* Top Line */}
                  <span
                    className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-left ${mobileMenuOpen ? "rotate-45 translate-x-px translate-y-px" : ""
                      }`}
                  />
                  {/* Middle Line */}
                  <span
                    className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0 translate-x-3" : "opacity-100"
                      }`}
                  />
                  {/* Bottom Line */}
                  <span
                    className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-left ${mobileMenuOpen ? "-rotate-45 translate-x-px -translate-y-px" : ""
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="hidden md:block bg-white">
          <div className="container-main">
            <div className="flex items-center justify-between py-2">
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-28 lg:ml-40">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 lg:px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors duration-200"
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
                    className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
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
                              <CloudinaryImage
                                src={product.images?.[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                                publicId={product.images?.[0]?.publicId}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
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
      </header>

      {/* Mobile Menu - Outside header so it's visible when header hides */}
      {/* Mobile Menu - Outside header so it's visible when header hides */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[60] overflow-y-auto hide-scrollbar">
          <div className="container-main py-4 space-y-6">
            {/* Company Name & Close Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">{settings?.site?.name || 'Root Suppliers'}</h2>
                <p className="text-xs text-primary-600 font-medium">Pvt. Ltd.</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close Menu"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile Search */}
            <div ref={mobileSearchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 shadow-sm"
                />
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 bg-primary-50 rounded-md transition-colors"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </button>

                {/* Mobile Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[70]">
                    <div className="py-2">
                      {suggestions.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            setShowSuggestions(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 border-b border-gray-50 last:border-0 group"
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <CloudinaryImage
                              src={product.images?.[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                              publicId={product.images?.[0]?.publicId}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
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
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-3.5 px-4 rounded-xl transition-all border-b border-gray-50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2.5 rounded-full bg-primary-100 flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Call Us Now</p>
                  <a href={`tel:${settings?.contact?.primaryPhone || '9851222637'}`} className="text-base font-bold text-gray-900 tracking-wide whitespace-nowrap">{settings?.contact?.primaryPhone || '9851222637'}</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2.5 rounded-full bg-red-100">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Visit Our Showroom</p>
                  <span className="text-sm text-gray-700 font-bold">{settings?.contact?.address || 'Pulchowk, Kharji Chowk'}</span>
                </div>
              </div>
              <a
                href={settings?.contact?.googleMapsLink || 'https://maps.app.goo.gl/jRWqSiE9fjLfv45r8'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md active:scale-[0.98]"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation - Stays fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/' ? 'text-primary-600' : 'text-gray-500'}`}
          >
            <div className={`p-1 rounded-full ${pathname === '/' ? 'bg-primary-50' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-[11px] font-medium">Home</span>
          </Link>
          <Link href="/products" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname?.startsWith('/products') ? 'text-primary-600' : 'text-gray-500'}`}>
            <div className={`p-1 rounded-full ${pathname?.startsWith('/products') ? 'bg-primary-50' : ''}`}>
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Products</span>
          </Link>
          <button onClick={() => setMobileCategoryOpen(true)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileCategoryOpen ? 'text-primary-600' : 'text-gray-500'}`}>
            <div className={`p-1 rounded-full ${mobileCategoryOpen ? 'bg-primary-50' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
            <span className="text-[11px] font-medium">Categories</span>
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileMenuOpen ? 'text-primary-600' : 'text-gray-500'}`}>
            <div className={`p-1 rounded-full ${mobileMenuOpen ? 'bg-primary-50' : ''}`}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </div>
            <span className="text-[11px] font-medium">Menu</span>
          </button>
        </div>
      </div>

      <MobileCategoryMenu isOpen={mobileCategoryOpen} onClose={() => setMobileCategoryOpen(false)} />
    </>
  );
}
