'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CloudinaryImage } from '@/components/ui/CloudinaryImage'
import { PLACEHOLDER_IMAGES } from '@/lib/cloudinary'

// Default fallback slides
const defaultSlides = [
  {
    image: { url: PLACEHOLDER_IMAGES.HERO, publicId: '' },
    title: 'Root Suppliers',
    subtitle: 'All Construction Solutions Under One Roof',
  },
  {
    image: { url: PLACEHOLDER_IMAGES.HERO, publicId: '' },
    title: 'Quality Hardware',
    subtitle: 'Construction tools and building materials',
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <section className="bg-white pt-16 pb-10 min-h-[calc(100vh-160px)]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Left Side - Main Carousel (larger size) */}
          <div className="lg:w-3/5 relative">
            <div className="overflow-hidden rounded-lg h-full" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px]">
                      <CloudinaryImage
                        src={slide.image.url}
                        publicId={slide.image.publicId}
                        alt={slide.title || 'Hero slide'}
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors ${index === selectedIndex ? 'bg-primary-600' : 'bg-white/70'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Top Selling Products (6 products in 3x2 grid) */}
          <div className="lg:w-2/5">
            <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 rounded-2xl p-4 md:p-5 h-full flex flex-col shadow-md border border-red-100">
              <div className="flex items-center justify-center mb-4 md:mb-5 pb-3 md:pb-4 border-b border-red-200">
                <h2 className="text-lg md:text-xl font-bold text-center text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-2xl"></span>
                  Top Selling Products
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                {topProducts.slice(0, 6).map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col border border-gray-100 hover:border-red-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <CloudinaryImage
                        src={product.images?.[0]?.url || PLACEHOLDER_IMAGES.PRODUCT}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-2 md:p-2.5 text-center mt-auto">
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </span>
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
