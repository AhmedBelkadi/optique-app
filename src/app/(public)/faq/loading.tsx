import { Skeleton } from '@/components/ui/skeleton';

export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-2xl mx-auto" />
        </div>

        {/* FAQ Items Skeleton */}
        <div className="max-w-4xl mx-auto space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>

        {/* Contact CTA Skeleton */}
        <div className="text-center mt-16">
          <Skeleton className="h-8 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-2xl mx-auto mb-8" />
          <Skeleton className="h-12 w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}
