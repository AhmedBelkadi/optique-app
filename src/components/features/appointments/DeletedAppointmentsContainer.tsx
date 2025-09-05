'use client';

import { useState } from 'react';
import { Appointment } from '@/features/appointments/schema/appointmentSchema';
import { restoreAppointmentAction } from '@/features/appointments/actions/restoreAppointment';
import { useCSRF } from '@/components/common/CSRFProvider';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DeletedAppointmentsContainerProps {
  initialDeletedAppointments: Appointment[];
}

export default function DeletedAppointmentsContainer({ 
  initialDeletedAppointments 
}: DeletedAppointmentsContainerProps) {
  const { csrfToken } = useCSRF();
  const [deletedAppointments, setDeletedAppointments] = useState<Appointment[]>(initialDeletedAppointments);
  const [restoring, setRestoring] = useState<string | null>(null);

  const handleRestore = async (appointmentId: string) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setRestoring(appointmentId);
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointmentId);
      formData.append('csrf_token', csrfToken);

      const result = await restoreAppointmentAction({}, formData);
      
      if (result.success) {
        setDeletedAppointments(prev => prev.filter(a => a.id !== appointmentId));
        toast.success('Rendez-vous restauré avec succès!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
      } else {
        toast.error(result.error || 'Échec de la restauration du rendez-vous');
      }
    } catch (error) {
      console.error('Error restoring appointment:', error);
      toast.error('Échec de la restauration du rendez-vous');
    } finally {
      setRestoring(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (deletedAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No deleted appointments</h3>
        <p className="text-muted-foreground">Deleted appointments will appear here and can be restored.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deleted Appointments ({deletedAppointments.length})</h2>
      </div>

      <div className="grid gap-4">
        {deletedAppointments.map((appointment) => (
          <Card key={appointment.id} className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {appointment.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(appointment.status.name)}`}>
                      {appointment.status.displayName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Deleted on {format(new Date(appointment.deletedAt!), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleRestore(appointment.id)}
                  disabled={restoring === appointment.id}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  {restoring === appointment.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Restore
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {appointment.customer && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Customer:</span> {appointment.customer.name}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(appointment.startTime), 'MMM dd, yyyy HH:mm')} - {format(new Date(appointment.endTime), 'HH:mm')}
                  </div>
                </div>
                {appointment.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {appointment.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
