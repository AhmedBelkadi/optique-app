import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AppointmentsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Appointments List Skeleton */}
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Title and status */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                  </div>

                  {/* Date and time */}
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </div>

                  {/* Customer info */}
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  </div>

                  {/* Notes */}
                  <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                </div>

                {/* Actions */}
                <div className="ml-4">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}