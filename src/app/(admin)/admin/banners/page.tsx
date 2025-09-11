import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import BannerScheduler from '@/components/features/banners/BannerScheduler';
import { getAllBannersAction } from '@/features/banners/actions/getAllBannersAction';
import { requirePermission } from '@/lib/auth/authorization';
  
// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ContentBannersPage() {

  await requirePermission('banners', 'read');
  const bannersResult = await getAllBannersAction();
  const banners = bannersResult.success ? (bannersResult as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Bannières & Promotions"
        subtitle="Gérez les bannières et les promotions"
        breadcrumbs={[
          { label: 'Bannières & Promotions' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="space-y-6">
        <div className="md:px-6 lg:px-0">
          <Suspense fallback={<BannersSkeleton />}>
            <BannerScheduler banners={banners} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function BannersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Overview Skeleton */}
      <Skeleton className="h-32 w-full" />
      
      {/* Content Breakdown Skeleton */}
      <Skeleton className="h-24 w-full" />
      
      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
