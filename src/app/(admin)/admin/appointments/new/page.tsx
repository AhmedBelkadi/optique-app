import { Suspense } from 'react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import AppointmentCreateContainer from '@/components/features/appointments/AppointmentCreateContainer';
import AppointmentCreateSkeleton from '@/components/features/appointments/AppointmentCreateSkeleton';
import { requirePermission } from '@/lib/auth/authorization';

export default async function NewAppointmentPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('appointments', 'create');

  return (
    <>
      <AdminPageConfig
        title="Nouveau rendez-vous"
        subtitle="Créer un nouveau rendez-vous pour un client."
        breadcrumbs={[
          { label: 'Appointments', href: '/admin/appointments' },
          { label: 'Nouveau', href: '/admin/appointments/new' }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          <Suspense fallback={<AppointmentCreateSkeleton />}>
            <AppointmentCreateContainer />
          </Suspense>
        </div>
      </div>
    </>
  );
} 