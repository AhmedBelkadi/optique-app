import { getCurrentUser } from '@/features/auth/services/session';
import AdminLayout from '@/components/features/admin/AdminLayout';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AdminLayout user={user}>
      {children}
    </AdminLayout>
  );
} 