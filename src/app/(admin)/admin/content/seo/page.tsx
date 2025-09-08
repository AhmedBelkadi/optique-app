import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import SEOManagementForm from '@/components/features/seo/SEOManagementForm';
import { getSEOSettingsAction } from '@/features/seo/actions/getSEOSettingsAction';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ContentSEOPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('seo', 'read');

  const seoResult = await getSEOSettingsAction();
  
  if (!seoResult.success) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading SEO Settings</h1>
          <p className="text-muted-foreground">{seoResult.error}</p>
        </div>
      </div>
    );
  }

  const seoSettings = seoResult.data!;

  return (
    <>
      <AdminPageConfig
        title="SEO Management"
        subtitle="Comprehensive search engine optimization for all your public pages"
        breadcrumbs={[
          { label: 'Content Management', href: '/admin/content' },
          { label: 'SEO Management' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="min-h-screen">
        <Suspense fallback={<SEOSettingsSkeleton />}>
          <SEOManagementForm settings={seoSettings as any} />
        </Suspense>
      </div>
    </>
  );
}

function SEOSettingsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}