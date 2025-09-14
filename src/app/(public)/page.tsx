import { Suspense } from 'react';
import { getAllHomeValues } from '@/features/home/services/homeValuesService';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getPublicProducts } from '@/features/products/services/getPublicProducts';
import { getPublicTestimonials } from '@/features/testimonials/services/getPublicTestimonials';
import DynamicValues from '@/components/features/home/DynamicValues';
import FeaturedProducts from '@/components/features/home/FeaturedProducts';
import Testimonials from '@/components/features/home/Testimonials';
import DynamicContactSection from '@/components/features/home/DynamicContactSection';
import { Button } from '@/components/ui/button';
import { SectionDivider } from '@/components/ui/section-divider';
import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ui/error-boundary';

import Image from 'next/image';

// Cache homepage for 15 minutes; content stays reasonably fresh
export const revalidate = 900;

async function HomeContent() {
  // Fetch all data in parallel
  const [homeValuesResult, contactSettingsResult, siteSettingsResult, productsResult, testimonialsResult] = await Promise.all([
    getAllHomeValues(),
    getContactSettings(),
    getSiteSettings(),
    getPublicProducts({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
    getPublicTestimonials()
  ]);

  const homeValues = homeValuesResult.success && homeValuesResult.data ? homeValuesResult.data : [];
  const contactSettings = contactSettingsResult.success ? contactSettingsResult.data : null;
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;
  const products = productsResult.success && productsResult.data ? productsResult.data : [];
  const testimonials = testimonialsResult.success && testimonialsResult.data ? testimonialsResult.data : [];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMmU4ZjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge - Only show if there's badge content */}
              {siteSettings?.heroBadge && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  {siteSettings.heroBadge}
                </div>
              )}
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                  {siteSettings?.siteName || 'Notre Boutique'}
                  {siteSettings?.heroSubtitle && (
                    <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                      {siteSettings.heroSubtitle}
                    </span>
                  )}
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
              </div>
              
              {/* Description */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                {siteSettings?.slogan || `Votre vision, notre passion. Spécialiste des lunettes de vue et de soleil à ${contactSettings?.city || 'notre ville'}.`}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/appointment">
                  <Button className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold px-8 py-4 h-14 flex items-center justify-center space-x-3 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <Eye className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg">Prendre RDV</span>
                  </Button>
                </Link>
                <Link href={contactSettings?.googleMapLink || '#'} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="group border-2 border-border hover:border-primary text-foreground hover:text-primary font-semibold px-8 py-4 h-14 flex items-center justify-center space-x-3 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="text-lg">Visiter la Boutique</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
              
              {/* Stats - Only show if there are stats configured */}
              {siteSettings?.heroStats && siteSettings.heroStats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                  {siteSettings.heroStats.map((stat: any, index: number) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative group">
                {/* Main Image Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={siteSettings?.heroBackgroundImg || '/placeholder.svg?height=600&width=600'}
                    alt="Collection de lunettes premium"
                    width={600}
                    height={600}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Cards - Only show if configured */}
                {siteSettings?.heroFloatingCards && siteSettings.heroFloatingCards.length > 0 && (
                  <>
                    {siteSettings.heroFloatingCards.map((card: any, index: number) => (
                      <div 
                        key={index}
                        className={`absolute ${card.position} bg-background rounded-2xl shadow-xl p-4 transform ${card.rotation} hover:rotate-0 transition-transform duration-300 border border-border`}
                      >
                        {card.type === 'status' ? (
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 ${card.color || 'bg-green-500'} rounded-full`}></div>
                            <span className="text-sm font-medium text-foreground">{card.text}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{card.value}</div>
                            <div className="text-xs text-muted-foreground">{card.label}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider variant="gradient" color="both" />

      {/* Values Section - Dynamic (Admin Editable) */}
      <DynamicValues 
        values={homeValues} 
        siteSettings={siteSettings?.siteName || null} 
      />

      {/* Section Divider */}
      {products.length > 0 && <SectionDivider variant="dots" color="both" />}

      {/* Featured Products */}
      {products.length > 0 && (
        <Suspense fallback={<FeaturedProductsSkeleton /> }>
          <FeaturedProducts products={products} />
        </Suspense>
      )}

      {/* Section Divider */}
      {testimonials.length > 0 && <SectionDivider variant="wave" color="both" />}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <Testimonials 
          testimonials={testimonials} 
        />
      )}

      {/* Section Divider */}
      <SectionDivider variant="gradient" color="both" />

      {/* Contact Section */}
      <DynamicContactSection 
        contactSettings={contactSettings || null} 
      />
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-16 bg-primary-foreground/20 rounded mb-6 animate-pulse"></div>
            <div className="h-8 bg-primary-foreground/20 rounded mb-8 max-w-3xl mx-auto animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-primary-foreground/20 rounded animate-pulse"></div>
              <div className="h-12 bg-primary-foreground/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-muted rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-muted rounded mx-auto mb-4 w-48 animate-pulse" />
          <div className="h-5 bg-muted/70 rounded mx-auto w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
