import { ProductGridSkeleton } from '@/components/features/products/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6 bg-primary-foreground/20" />
          <Skeleton className="h-6 w-2xl mx-auto bg-primary-foreground/20" />
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-8 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGridSkeleton />
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
