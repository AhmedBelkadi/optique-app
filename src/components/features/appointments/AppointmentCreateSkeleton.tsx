import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AppointmentCreateSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Appointment Information Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-24 w-full bg-muted animate-pulse rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-24 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Customer Information Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-24 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Info Card Skeleton */}
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <div className="h-4 w-32 bg-blue-200 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-3 w-80 bg-blue-200 animate-pulse rounded" />
              <div className="h-3 w-72 bg-blue-200 animate-pulse rounded" />
              <div className="h-3 w-76 bg-blue-200 animate-pulse rounded" />
              <div className="h-3 w-64 bg-blue-200 animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
