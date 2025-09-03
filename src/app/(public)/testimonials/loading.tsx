import { TestimonialsGridSkeleton } from '@/components/features/testimonials/TestimonialCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestimonialsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6 bg-primary-foreground/20" />
          <Skeleton className="h-6 w-2xl mx-auto bg-primary-foreground/20" />
        </div>
      </section>

      {/* Search Section Skeleton */}
      <section className="py-8 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </section>

      {/* Testimonials Grid Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsGridSkeleton />
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-9 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-9 w-80 mx-auto mb-4 bg-primary-foreground/20" />
          <Skeleton className="h-6 w-2xl mx-auto mb-8 bg-primary-foreground/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 bg-primary-foreground/20" />
            <Skeleton className="h-12 w-40 bg-primary-foreground/20" />
          </div>
        </div>
      </section>
    </div>
  );
}
