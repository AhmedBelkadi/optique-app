"use client"

import { Testimonial } from "@/features/testimonials/schema/testimonialSchema"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  // Take only the first 6 testimonials for home page display
  const featuredTestimonials = testimonials.slice(0, 6)

  // Use CSS variables for consistent theming
  const badgeBackground = 'hsl(var(--primary))' // Primary color
  const badgeText = 'hsl(var(--primary-foreground))' // Primary foreground
  const starColor = 'hsl(var(--secondary))' // Secondary color for stars
  const verifiedBadgeColor = 'hsl(var(--primary))' // Primary for verified badge

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
    const cardWidth = container.children[0]?.clientWidth || 320
    const gap = 16 // gap-4 = 16px
    const scrollPosition = index * (cardWidth + gap)
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    const maxIndex = Math.max(0, featuredTestimonials.length - 1)
    const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0
    scrollToIndex(nextIndex)
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, featuredTestimonials.length - 1)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex
    scrollToIndex(prevIndex)
  }

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide()
      }
    }, 6000) // Auto-scroll every 6 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isDragging])

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-secondary/3 via-background to-primary/3 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 bg-secondary/10 text-secondary border border-secondary/20">
            <Quote className="w-4 h-4 mr-2" />
            Ce que disent nos clients
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mb-6"></div>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui nous font confiance pour leur vision
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredTestimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{
                        backgroundColor: `${badgeBackground}20`
                      }}
                    >
                      <Quote 
                        className="h-6 w-6" 
                        style={{ color: badgeBackground }}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < (testimonial.rating || 5) ? "fill-current" : ""}`}
                          style={{ 
                            color: i < (testimonial.rating || 5) ? starColor : '#D1D5DB'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground text-center mb-6 leading-relaxed italic">
                    "{testimonial.message}"
                  </p>

                  {/* Client Info */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      {testimonial.image && testimonial.image.trim() !== '' && testimonial.image !== 'null' ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-15 h-15 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${badgeBackground}20`
                          }}
                        >
                          <span 
                            className="font-semibold text-lg"
                            style={{ color: badgeBackground }}
                          >
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-foreground mb-1">{testimonial.name}</h4>
                    {testimonial.title && (
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    )}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {testimonial.isVerified && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{
                            backgroundColor: verifiedBadgeColor,
                            color: '#FFFFFF'
                          }}
                        >
                          ✓ Vérifié
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className="text-xs capitalize"
                      >
                        {testimonial.source === 'internal' ? 'Interne' : 
                         testimonial.source === 'facebook' ? 'Facebook' :
                         testimonial.source === 'google' ? 'Google' :
                         testimonial.source === 'trustpilot' ? 'Trustpilot' : 'Interne'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden relative">
          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="h-10 w-10 rounded-full p-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2">
              {featuredTestimonials.map((_, index) => (
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
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="h-10 w-10 rounded-full p-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-lg"
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
            {featuredTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-80 snap-center"
                style={{ minWidth: '320px' }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-3 rounded-full"
                        style={{
                          backgroundColor: `${badgeBackground}20`
                        }}
                      >
                        <Quote 
                          className="h-6 w-6" 
                          style={{ color: badgeBackground }}
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (testimonial.rating || 5) ? "fill-current" : ""}`}
                            style={{ 
                              color: i < (testimonial.rating || 5) ? starColor : '#D1D5DB'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-muted-foreground text-center mb-6 leading-relaxed italic flex-grow">
                      "{testimonial.message}"
                    </p>

                    {/* Client Info */}
                    <div className="text-center mt-auto">
                      <div className="flex justify-center mb-3">
                        {testimonial.image && testimonial.image.trim() !== '' && testimonial.image !== 'null' ? (
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={60}
                            height={60}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-15 h-15 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${badgeBackground}20`
                            }}
                          >
                            <span 
                              className="font-semibold text-lg"
                              style={{ color: badgeBackground }}
                            >
                              {testimonial.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-foreground mb-1">{testimonial.name}</h4>
                      {testimonial.title && (
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      )}
                      <div className="flex items-center justify-center gap-2 mt-2">
                        {testimonial.isVerified && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{
                              backgroundColor: verifiedBadgeColor,
                              color: '#FFFFFF'
                            }}
                          >
                            ✓ Vérifié
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className="text-xs capitalize"
                        >
                          {testimonial.source === 'internal' ? 'Interne' : 
                           testimonial.source === 'facebook' ? 'Facebook' :
                           testimonial.source === 'google' ? 'Google' :
                           testimonial.source === 'trustpilot' ? 'Trustpilot' : 'Interne'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Glissez pour voir plus • {currentIndex + 1} / {featuredTestimonials.length}
            </p>
          </div>
        </div>

        {/* View All Testimonials */}
        <div className="text-center mt-8 md:mt-12">
          <Link href="/testimonials">
            <Button 
              style={{ 
                borderColor: badgeBackground,
              }}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Voir tous les témoignages
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
