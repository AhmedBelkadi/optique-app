import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import DashboardMetrics from '@/components/features/admin/DashboardMetrics';
import RecentProducts from '@/components/features/admin/RecentProducts';
import UpcomingAppointments from '@/components/features/admin/UpcomingAppointments';
import AdminQuickActions from '@/components/features/admin/AdminQuickActions';
import DataQualityDashboard from '@/components/features/admin/DataQualityDashboard';
import { requirePermission } from '@/lib/auth/authorization';
import { getCurrentUser } from '@/features/auth/services/session';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function AdminDashboard() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  // Dashboard is accessible to both admin and staff, but we need basic access
  await requirePermission('dashboard', 'read');
  
  // Get current user for role-based filtering
  const user = await getCurrentUser();

  return (
    <>
      <AdminPageConfig
        title="Tableau de Bord"
        subtitle="Aperçu de votre entreprise optique"
        breadcrumbs={[
          { label: 'Tableau de Bord', href: '/admin' }
        ]}
      />

      <div className="space-y-6">
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>

        {/* Quick Actions Section */}
        {/* <Suspense fallback={<QuickActionsSkeleton />}>
          <AdminQuickActions user={user}  />
        </Suspense> */}

        {/* Data Quality Dashboard */}
        <Suspense fallback={<DataQualitySkeleton />}>
          <DataQualityDashboard />
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
        <CardTitle>Produits Récents</CardTitle>
        <CardDescription>Derniers produits ajoutés à votre catalogue</CardDescription>
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

function QuickActionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`category-skeleton-${i}`} className="h-9 w-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={`action-skeleton-${i}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-16 h-5" />
              </div>
              <Skeleton className="h-6 w-32 mt-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UpcomingAppointmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendez-vous à Venir</CardTitle>
        <CardDescription>Prochains rendez-vous programmés</CardDescription>
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

function DataQualitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`quality-skeleton-${i}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 