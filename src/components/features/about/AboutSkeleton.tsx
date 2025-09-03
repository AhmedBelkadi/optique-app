import { Skeleton } from '@/components/ui/skeleton';

export default function AboutSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-8 w-2xl mx-auto bg-white/20" />
        </div>
      </section>

      {/* Content Sections Skeleton */}
      {[1, 2, 3].map((index) => (
        <section key={index} className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8 lg:col-start-2'}>
                <Skeleton className="h-10 w-80 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
              <div className={index % 2 === 0 ? 'lg:pl-8' : 'lg:pr-8 lg:col-start-1'}>
                <Skeleton className="w-full h-80 lg:h-96 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-muted">
              <Skeleton className="h-8 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-2xl mx-auto mb-8" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
