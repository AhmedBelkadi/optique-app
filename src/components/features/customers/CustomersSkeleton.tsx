import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <div className="bg-background rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-48">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-48">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-32">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-background rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3 border-b">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 border-b last:border-b-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
