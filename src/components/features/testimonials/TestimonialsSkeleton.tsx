import { Skeleton } from '@/components/ui/skeleton';

export default function TestimonialsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <div className="bg-background rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border bg-background shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>

            {/* Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 