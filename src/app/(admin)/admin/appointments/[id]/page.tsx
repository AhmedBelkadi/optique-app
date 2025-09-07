import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getAppointmentAction } from '@/features/appointments/actions/getAppointmentAction';
import { getAppointmentStatusesAction } from '@/features/appointments/actions/getAppointmentStatusesAction';
import AppointmentDetailContainer from '@/components/features/appointments/AppointmentDetailContainer';
import AppointmentDetailSkeleton from '@/components/features/appointments/AppointmentDetailSkeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('appointments', 'read');

  const { id } = await params;
  
  const result = await getAppointmentAction(id);
  const statusesResult = await getAppointmentStatusesAction();
  const appointmentStatuses = statusesResult.success ? (statusesResult as any).data || [] : [];
  
  if (!result.success) {
    notFound();
  }

  const appointment = result.data;

  return (
    <>
      <AdminPageConfig
        title={`Rendez-vous - ${appointment.title}`}
        subtitle="Gérer les détails et le statut du rendez-vous."
        breadcrumbs={[
          { label: 'Appointments', href: '/admin/appointments' },
          { label: appointment.title, href: `/admin/appointments/${id}` }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          <div className="px-3 sm:px-4 md:px-6 lg:px-0">
            <Suspense fallback={<AppointmentDetailSkeleton />}>
              <AppointmentDetailContainer 
                appointment={appointment} 
                appointmentStatuses={appointmentStatuses}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
} 