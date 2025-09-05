import { getAllAppointmentsAction } from '@/features/appointments/actions/getAllAppointmentsAction';
import DeletedAppointmentsContainer from '@/components/features/appointments/DeletedAppointmentsContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function TrashPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('appointments', 'read');

  const result = await getAllAppointmentsAction({
    isDeleted: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });
  
  const deletedAppointments = result.success ? (result as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Trash"
        subtitle="Deleted appointments that can be restored"
        breadcrumbs={[
          { label: 'Appointments', href: '/admin/appointments' },
          { label: 'Trash' } // No href for current page
        ]}
        showSearch={false} // Hide search for trash page
        showNotifications={true}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="">
          {deletedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No deleted appointments</h3>
              <p className="text-muted-foreground">Deleted appointments will appear here and can be restored.</p>
            </div>
          ) : (
            <DeletedAppointmentsContainer initialDeletedAppointments={deletedAppointments} />
          )}
        </div>
      </div>
    </>
  );
}
