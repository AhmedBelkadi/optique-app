import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="text-center space-y-4">
      <div className="h-12 bg-muted rounded-lg animate-pulse max-w-2xl mx-auto" />
      <div className="h-6 bg-muted rounded-lg animate-pulse max-w-3xl mx-auto" />
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-16 bg-primary-foreground/20 rounded mb-6 animate-pulse" />
          <div className="h-8 bg-primary-foreground/20 rounded mb-8 max-w-3xl mx-auto animate-pulse" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-primary-foreground/20 rounded animate-pulse w-48" />
            <div className="h-12 bg-primary-foreground/20 rounded animate-pulse w-48" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-lg animate-pulse" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded w-20 animate-pulse" />
            <div className="h-8 bg-muted rounded w-16 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Products Grid Skeleton
export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Details Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Product Images */}
      <div className="space-y-6">
        <div className="aspect-square bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-16 bg-muted rounded-lg animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Testimonial Card Skeleton
export function TestimonialCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-muted rounded mr-1 animate-pulse" />
          ))}
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse mr-3" />
          <div className="space-y-1">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="h-3 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Testimonials Grid Skeleton
export function TestimonialsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  );
}

// FAQ Item Skeleton
export function FAQItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            <div className="h-5 bg-muted rounded w-64 animate-pulse" />
          </div>
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

// FAQ List Skeleton
export function FAQListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {[...Array(count)].map((_, i) => (
        <FAQItemSkeleton key={i} />
      ))}
    </div>
  );
}

// About Section Skeleton
export function AboutSectionSkeleton() {
  return (
    <Card className="p-8 md:p-12 mb-16">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
            </div>
          </div>
          <div className="aspect-video bg-muted rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Benefits Grid Skeleton
export function BenefitsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="text-center p-6">
          <CardContent className="p-0">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded mb-3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 mx-auto animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Contact Form Skeleton
export function ContactFormSkeleton() {
  return (
    <Card className="p-8 md:p-12">
      <CardContent className="p-0">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-14 bg-muted rounded animate-pulse" />
            </div>
          ))}
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Contact Info Skeleton
export function ContactInfoSkeleton() {
  return (
    <Card className="p-8 md:p-12">
      <CardContent className="p-0">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-5 bg-muted rounded w-2/3 animate-pulse" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Appointment Form Skeleton
export function AppointmentFormSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="h-6 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {[...Array(2)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <div className="h-6 bg-muted rounded w-32 animate-pulse" />
              {[...Array(3)].map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Information Cards Skeleton
export function InformationCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="shadow-lg">
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-6 bg-muted rounded w-20 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeaderSkeleton />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
