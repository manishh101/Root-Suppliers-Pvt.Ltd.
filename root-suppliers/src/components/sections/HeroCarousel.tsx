'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react'
import { CloudinaryImage } from '@/components/ui/CloudinaryImage'
import { PLACEHOLDER_IMAGES } from '@/lib/cloudinary'

// Default fallback slides
const defaultSlides = [
  {
    image: { url: PLACEHOLDER_IMAGES.HERO, publicId: '' },
    title: 'Root Suppliers',
    subtitle: 'All Construction Solutions Under One Roof',
    ctaText: 'Explore Products',
    ctaLink: '/products',
  },
  {
    image: { url: PLACEHOLDER_IMAGES.HERO, publicId: '' },
    title: 'Quality Hardware',
    subtitle: 'Premium construction tools and building materials',
    ctaText: 'View Collection',
    ctaLink: '/categories',
  },
]

interface HeroSlide {
  image: { url: string; publicId: string };
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: { url: string; alt: string }[];
}

interface HeroCarouselProps {
  topProducts?: Product[];
  heroSlides?: HeroSlide[];
}

export function HeroCarousel({ topProducts = [], heroSlides }: HeroCarouselProps) {
  // Use provided slides or fallback to defaults
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : defaultSlides;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-play (pause on hover)
  useEffect(() => {
    if (!emblaApi || isHovered) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi, isHovered])

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white pt-20 pb-10 min-h-[calc(100vh-160px)]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-5 h-full">
          {/* Left Side - Main Carousel (larger size) */}
          <div
            className="lg:w-3/5 relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="overflow-hidden rounded-2xl h-full shadow-2xl" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                    <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px]">
                      <CloudinaryImage
                        src={slide.image.url}
                        publicId={slide.image.publicId}
                        alt={slide.title || 'Hero slide'}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Gradient Overlay for Text Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                      {/* Text Overlay Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                        <div className="max-w-xl">
                          {slide.title && (
                            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg animate-fade-up">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-5 md:mb-6 drop-shadow-md max-w-md">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.ctaText && slide.ctaLink && (
                            <Link
                              href={slide.ctaLink}
                              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group/btn hover:scale-105"
                            >
                              <span>{slide.ctaText}</span>
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Navigation Arrows with Glassmorphism */}
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-md" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-md" />
            </button>

            {/* Enhanced Pill-shaped Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Enhanced Top Selling Products Panel */}
          <div className="lg:w-2/5">
            <div className="bg-gradient-to-br from-white via-red-50/50 to-white rounded-2xl p-5 md:p-6 h-full flex flex-col shadow-xl border border-gray-100 relative overflow-hidden">
              {/* Decorative Background Element */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-100/50 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-100/50 rounded-full blur-2xl" />

              {/* Header with Icon */}
              <div className="relative z-10 flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-base md:text-xl font-bold text-gray-800 capitalize">
                    Top Selling
                  </h2>
                </div>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {topProducts.length}+ Items
                </span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 relative z-10">
                {topProducts.slice(0, 6).map((product, index) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100 hover:border-primary-300 hover:-translate-y-2 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                      <CloudinaryImage
                        src={product.images?.[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Quick View Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        View
                      </div>
                    </div>
                    <div className="p-2.5 text-center mt-auto bg-gradient-to-t from-gray-50 to-white">
                      <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All CTA */}
              <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
                <Link
                  href="/products?filter=topSelling"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
