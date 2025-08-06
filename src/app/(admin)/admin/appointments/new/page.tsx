import AppointmentForm from '@/components/features/appointments/AppointmentForm';

export default function NewAppointmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Appointment</h1>
        <p className="text-gray-600 mt-2">
          Schedule a new appointment with a customer.
        </p>
      </div>

      <AppointmentForm mode="create" />
    </div>
  );
} 