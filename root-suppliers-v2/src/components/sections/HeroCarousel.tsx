'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Hero carousel slides
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/image.png',
    alt: 'Hardware store with construction tools and equipment',
  },
  {
    id: 2,
    image: '/images/hero/image copy.png',
    alt: 'Construction tools and building materials',
  },
]

// Top selling products - 6 products using available images
const topProducts = [
  {
    id: 1,
    name: 'Power Tools',
    image: '/images/products/image.png',
    href: '/products/power-tools',
  },
  {
    id: 2,
    name: 'Hardware Supplies',
    image: '/images/products/image copy.png',
    href: '/products/hardware-supplies',
  },
  {
    id: 3,
    name: 'Plumbing Materials',
    image: '/images/products/image copy 2.png',
    href: '/products/plumbing-materials',
  },
  {
    id: 4,
    name: 'Electrical Fittings',
    image: '/images/products/image copy 3.png',
    href: '/products/electrical-fittings',
  },
  {
    id: 5,
    name: 'Construction Tools',
    image: '/images/products/image.png',
    href: '/products/construction-tools',
  },
  {
    id: 6,
    name: 'Building Materials',
    image: '/images/products/image copy.png',
    href: '/products/building-materials',
  },
]

export function HeroCarousel() {
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
    <section className="bg-white pt-10 pb-8 min-h-[calc(100vh-160px)]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Left Side - Main Carousel (larger size) */}
          <div className="lg:w-3/5 relative">
            <div className="overflow-hidden rounded-lg h-full" ref={emblaRef}>
              <div className="flex h-full">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="flex-[0_0_100%] min-w-0">
                    <div className="relative w-full h-[500px] lg:h-[550px]">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === selectedIndex ? 'bg-primary-600' : 'bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Top Selling Products (6 products in 3x2 grid) */}
          <div className="lg:w-2/5">
            <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
              <h2 className="text-lg font-bold text-center mb-4 text-gray-800 uppercase tracking-wide">
                Top Selling Products
              </h2>
              <div className="grid grid-cols-3 gap-3 flex-1">
                {topProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 text-center mt-auto">
                      <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-1">
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
