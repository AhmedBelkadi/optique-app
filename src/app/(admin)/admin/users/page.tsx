import { Suspense } from 'react';
import { getAllUsers } from '@/features/users/queries/getAllUsers';
import { getAllRoles } from '@/features/auth/services/roleService';
import UsersContainer from '@/components/features/users/UsersContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import UsersSkeleton from '@/components/features/users/UsersSkeleton';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function UsersPage() {
  // Check if user has permission to read users
  await requirePermission('users', 'read');
  
  const [users, roles] = await Promise.all([
    getAllUsers(),
    getAllRoles(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageConfig
        title="Utilisateurs"
        subtitle="Gérer les comptes du personnel et les rôles"
      />

      {/* Users List */}
      <Suspense fallback={<UsersSkeleton />}>
        <UsersContainer users={users} roles={roles} />
      </Suspense>
    </div>
  );
}
