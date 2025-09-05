import { Suspense } from 'react';
import { getAllHomeValues } from '@/features/home/services/homeValuesService';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
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

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

async function HomeContent() {
  // Fetch all data in parallel
  const [homeValuesResult, contactSettingsResult, siteSettingsResult, productsResult, testimonialsResult] = await Promise.all([
    getAllHomeValues(),
    getContactSettings(),
    getSiteSettings(),
    getAllProducts(),
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
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/3 to-primary/10 py-12 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {siteSettings?.siteName || 'Notre Boutique'}
                  <span className="text-primary block">Style Premium</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {siteSettings?.slogan || `Votre vision, notre passion. Spécialiste des lunettes de vue et de soleil à ${contactSettings?.city || 'notre ville'}.`}              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link href="/appointment">
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-6 py-3 h-12 flex items-center justify-center space-x-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                    <Eye className="w-5 h-5" />
                    <span>Prendre RDV</span>
                  </Button>
                </Link>
                <Link href={contactSettings?.googleMapLink || '#'} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 hover:border-secondary/30 font-semibold px-6 py-3 h-12 flex items-center justify-center space-x-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300">
                    <span>Visiter la Boutique</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative">
                <Image
                  src={siteSettings?.heroBackgroundImg || '/placeholder.svg?height=600&width=600'}
                  alt="Collection de lunettes premium"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl w-full h-auto relative z-10"
                  priority
                />
                {/* Decorative border with secondary color */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-sm"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl"></div>
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
        <FeaturedProducts products={products} />
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
