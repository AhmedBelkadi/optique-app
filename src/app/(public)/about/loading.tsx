import { Skeleton } from '@/components/ui/skeleton';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2xl mx-auto mb-8" />
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </section>

      {/* About Content Skeleton */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="relative">
              <Skeleton className="w-full h-80 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-2xl mx-auto mb-8" />
          <Skeleton className="h-12 w-40 mx-auto" />
        </section>
      </div>
    </div>
  );
}
