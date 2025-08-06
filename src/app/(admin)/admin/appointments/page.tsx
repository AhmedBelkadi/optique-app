import { getAllAppointmentsAction } from '@/features/appointments/actions/getAllAppointmentsAction';
import AppointmentsContainer from '@/components/features/appointments/AppointmentsContainer';

export default async function AppointmentsPage() {
  const result = await getAllAppointmentsAction({
    isDeleted: false,
    sortBy: 'startTime',
    sortOrder: 'asc',
    page: 1,
    limit: 50,
  });

  const appointments = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-2">
          Manage your appointment calendar and schedule.
        </p>
      </div>

      <AppointmentsContainer 
        initialAppointments={appointments} 
        pagination={pagination}
      />
    </div>
  );
} 