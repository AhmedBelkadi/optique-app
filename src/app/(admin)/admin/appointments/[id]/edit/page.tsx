import { getAppointmentById } from '@/features/appointments/services/getAppointmentById';
import AppointmentForm from '@/components/features/appointments/AppointmentForm';
import { notFound } from 'next/navigation';

interface EditAppointmentPageProps {
  params: {
    id: string;
  };
}

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  const result = await getAppointmentById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Appointment</h1>
        <p className="text-gray-600 mt-2">
          Update appointment details and information.
        </p>
      </div>

      <AppointmentForm mode="edit" appointment={result.data} />
    </div>
  );
} 