import { Suspense } from 'react';
import { getAllPermissions } from '@/features/auth/services/roleService';
import PermissionManagement from '@/components/features/admin/PermissionManagement';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function PermissionsPage() {

  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('permissions', 'read');

  const permissions = await getAllPermissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageConfig
        title="Permission Management"
        subtitle="Manage system permissions and access controls"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Permissions' }
        ]}
      />

      {/* Permission Management Component */}
      <Suspense fallback={<PermissionsSkeleton />}>
        <PermissionManagement permissions={permissions} />
      </Suspense>
    </div>
  );
}

function PermissionsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Search and Filters Skeleton */}
      <div className="h-20 bg-muted animate-pulse rounded-lg" />

      {/* Permissions Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
