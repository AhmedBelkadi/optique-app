import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import DashboardMetrics from '@/components/features/admin/DashboardMetrics';
import RecentProducts from '@/components/features/admin/RecentProducts';
import UpcomingAppointments from '@/components/features/admin/UpcomingAppointments';

export default function AdminDashboard() {
  return (
    <>
      <AdminPageConfig
        title="Dashboard"
        subtitle="Overview of your optical business"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' }
        ]}
      />

      <div className="space-y-6">
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<RecentProductsSkeleton />}>
            <RecentProducts />
          </Suspense>

          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <UpcomingAppointments />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={`metric-skeleton-${i}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentProductsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
        <CardDescription>Latest products added to your catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`product-skeleton-${i}`} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAppointmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Next scheduled appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`appointment-skeleton-${i}`} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 