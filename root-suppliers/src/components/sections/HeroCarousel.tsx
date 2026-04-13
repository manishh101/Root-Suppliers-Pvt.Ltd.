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
    <section className="bg-white py-10 lg:py-12">
      <div className="container-main h-full">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Left Side - Main Carousel */}
          <div
            className="lg:w-2/3 relative group overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="h-full bg-gray-100" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-full lg:min-h-[600px]">
                      <CloudinaryImage
                        src={slide.image.url}
                        publicId={slide.image.publicId}
                        alt={slide.title || 'Hero slide'}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      {/* Clean Overlay */}
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                        <div className="max-w-2xl">
                          {slide.title && (
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight tracking-wide uppercase">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-sm md:text-base text-white/90 mb-6 font-light max-w-lg">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.ctaText && slide.ctaLink && (
                            <Link
                              href={slide.ctaLink}
                              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                              <span>{slide.ctaText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Navigation */}
            <div className="absolute bottom-8 right-8 hidden md:flex gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 text-white border border-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 text-white border border-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Side - Top Selling Products (Simplified) */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="bg-gray-50 rounded-2xl p-6 h-full flex flex-col border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 uppercase tracking-wide">
                  Top Selling
                </h3>
                <Link href="/products?filter=topSelling" className="text-sm font-medium text-secondary-600 hover:text-secondary-700">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {topProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-200 hover:border-gray-200 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full bg-gray-100">
                      <CloudinaryImage
                        src={product.images?.[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
