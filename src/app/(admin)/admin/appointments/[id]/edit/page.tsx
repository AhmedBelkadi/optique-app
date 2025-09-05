import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getAppointmentAction } from '@/features/appointments/actions/getAppointmentAction';
import AppointmentEditContainer from '@/components/features/appointments/AppointmentEditContainer';
import AppointmentEditSkeleton from '@/components/features/appointments/AppointmentEditSkeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';


// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

interface AppointmentEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentEditPage({ params }: AppointmentEditPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('appointments', 'update');

  const { id } = await params;
  
  const result = await getAppointmentAction(id);
  
  if (!result.success) {
    notFound();
  }

  const appointment = result.data;

  return (
    <>
      <AdminPageConfig
        title={`Modifier le rendez-vous - ${appointment.title}`}
        subtitle="Modifier les détails et la planification du rendez-vous."
        breadcrumbs={[
          { label: 'Appointments', href: '/admin/appointments' },
          { label: appointment.title, href: `/admin/appointments/${id}` },
          { label: 'Modifier', href: `/admin/appointments/${id}/edit` }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          <Suspense fallback={<AppointmentEditSkeleton />}>
            <AppointmentEditContainer appointment={appointment} />
          </Suspense>
        </div>
      </div>
    </>
  );
} 