import { Suspense } from 'react';
import { getAllRolesWithDetails, getAllPermissions } from '@/features/auth/services/roleService';
import RoleManagement from '@/components/features/roles/RoleManagement';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function RolesPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('roles', 'read');

  const [rolesWithDetails, permissions] = await Promise.all([
    getAllRolesWithDetails(),
    getAllPermissions(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageConfig
        title="Gestion des Rôles"
        subtitle="Gérer les rôles utilisateur et leurs permissions associées"
      />
      
      {/* Role Management Component */}
      <Suspense fallback={<div>Chargement...</div>}>
        <RoleManagement roles={rolesWithDetails} permissions={permissions} />
      </Suspense>
    </div>
  );
}
