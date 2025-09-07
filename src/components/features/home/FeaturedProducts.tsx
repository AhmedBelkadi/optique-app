"use client"

import { Product } from "@/features/products/schema/productSchema"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/ui/product-card"
import { useState, useRef, useEffect } from "react"

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (!products || products.length === 0) {
    return null
  }

  // Take only the first 6 products for featured display
  const featuredProducts = products.slice(0, 6)

  // Mobile swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Navigation functions
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.children[0]?.clientWidth || 280
    const gap = 16 // gap-4 = 16px
    const scrollPosition = index * (cardWidth + gap)
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    const maxIndex = Math.max(0, featuredProducts.length - 1)
    const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0
    scrollToIndex(nextIndex)
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, featuredProducts.length - 1)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex
    scrollToIndex(prevIndex)
  }

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide()
      }
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isDragging])

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background via-secondary/2 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 bg-secondary/10 text-secondary border border-secondary/20">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Collection Premium
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Nos Produits Vedettes</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de montures et verres de qualité pour tous les styles
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll Layout */}
        <div className="md:hidden relative">
          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="default"
              size="sm"
              onClick={prevSlide}
              className="h-10 w-10 rounded-full p-0 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={nextSlide}
              className="h-10 w-10 rounded-full p-0  backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-72 snap-center"
                style={{ minWidth: '280px' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Glissez pour voir plus • {currentIndex + 1} / {featuredProducts.length}
            </p>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 h-12 w-full sm:w-auto">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Voir Tous les Produits
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
