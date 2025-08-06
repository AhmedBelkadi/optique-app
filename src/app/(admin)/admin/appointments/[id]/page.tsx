import { getAppointmentById } from '@/features/appointments/services/getAppointmentById';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Edit, ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AppointmentDetailPageProps {
  params: {
    id: string;
  };
}

const statusConfig = {
  SCHEDULED: { label: 'Scheduled', variant: 'secondary' as const },
  CONFIRMED: { label: 'Confirmed', variant: 'default' as const },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' as const },
  COMPLETED: { label: 'Completed', variant: 'default' as const },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
  NO_SHOW: { label: 'No Show', variant: 'destructive' as const },
};

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const result = await getAppointmentById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const appointment = result.data;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationText = durationHours > 0 
    ? `${durationHours}h ${durationMinutes}m`
    : `${durationMinutes}m`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{appointment.title}</h1>
            <p className="text-gray-600 mt-1">Appointment Details</p>
          </div>
        </div>
        <Link href={`/admin/appointments/${appointment.id}/edit`}>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit Appointment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Information</CardTitle>
              <CardDescription>
                Details about this appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date & Time
                  </div>
                  <p className="font-medium">{formatDateTime(startTime)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </div>
                  <p className="font-medium">{durationText}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Time Range
                </div>
                <p className="font-medium">
                  {formatTime(startTime)} - {formatTime(endTime)}
                </p>
              </div>

              {appointment.description && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Description</div>
                  <p className="text-gray-700">{appointment.description}</p>
                </div>
              )}

              {appointment.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Notes</div>
                  <p className="text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Details about the customer for this appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{appointment.customer?.name}</h4>
                  <p className="text-sm text-gray-500">{appointment.customer?.email}</p>
                </div>
              </div>

              {appointment.customer?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{appointment.customer.phone}</span>
                </div>
              )}

              {appointment.customer?.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{appointment.customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(appointment.status)}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created
                </div>
                <p className="text-sm">{formatDateTime(appointment.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last Updated
                </div>
                <p className="text-sm">{formatDateTime(appointment.updatedAt)}</p>
              </div>
              {appointment.deletedAt && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deleted
                  </div>
                  <p className="text-sm">{formatDateTime(appointment.deletedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/admin/customers/${appointment.customerId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  View Customer
                </Button>
              </Link>
              <Link href={`/admin/appointments/${appointment.id}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 