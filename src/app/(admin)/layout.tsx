import { getCurrentUser } from '@/features/auth/services/session';
import AdminLayout from '@/components/features/admin/AdminLayout';

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