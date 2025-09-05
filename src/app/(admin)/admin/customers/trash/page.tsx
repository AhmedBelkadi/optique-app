import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import DeletedCustomersContainer from '@/components/features/customers/DeletedCustomersContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function TrashPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('customers', 'read');

  const result = await getAllCustomersAction({
    isDeleted: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });
  
  const deletedCustomers = result.success ? (result as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Trash"
        subtitle="Deleted customers that can be restored"
        breadcrumbs={[
          { label: 'Customers', href: '/admin/customers' },
          { label: 'Trash' } // No href for current page
        ]}
        showSearch={false} // Hide search for trash page
        showNotifications={true}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="">
          {deletedCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No deleted customers</h3>
              <p className="text-muted-foreground">Deleted customers will appear here and can be restored.</p>
            </div>
          ) : (
            <DeletedCustomersContainer initialDeletedCustomers={deletedCustomers} />
          )}
        </div>
      </div>
    </>
  );
}
