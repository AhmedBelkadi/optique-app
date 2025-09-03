import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AppointmentDetailSkeleton() {
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
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointment & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Information Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-5 w-64 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Management Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>

          {/* Timestamps Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>

          {/* Danger Zone Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
