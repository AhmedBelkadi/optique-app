import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, User } from 'lucide-react';
import { getAllAppointments } from '@/features/appointments/services/getAllAppointments';
import { AppointmentStatus, Appointment } from '@/features/appointments/schema/appointmentSchema';

export default async function UpcomingAppointments() {
  // Get upcoming appointments (not deleted, sorted by start time)
  const result = await getAllAppointments({
    limit: 5,
    page: 1,
    sortBy: 'startTime',
    sortOrder: 'asc',
    startDate: new Date(), // Only future appointments
  });

  const appointments: Appointment[] = result.success ? result.data || [] : [];

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800';
      case 'SCHEDULED':
        return 'bg-amber-100 text-amber-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-primary/10 text-primary';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive';
      case 'NO_SHOW':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next scheduled appointments</CardDescription>
          </div>
          <Link 
            href="/admin/appointments" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No upcoming appointments</p>
            <p className="text-sm">Schedule appointments to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {appointment.customer ? getInitials(appointment.customer.name) : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium truncate">
                      {appointment.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {appointment.customer?.name || 'Unknown Customer'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDate(appointment.startTime)} at {formatTime(appointment.startTime)}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/admin/appointments/${appointment.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 