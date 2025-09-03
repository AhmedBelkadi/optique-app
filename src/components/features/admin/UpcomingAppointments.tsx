import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, User, AlertTriangle, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import { getAllAppointments } from '@/features/appointments/services/getAllAppointments';
import { AppointmentStatus, Appointment } from '@/features/appointments/schema/appointmentSchema';

export default async function UpcomingAppointments() {
  // Get all appointments (not deleted, sorted by start time)
  const result = await getAllAppointments({
    limit: 100, // Get more appointments to filter
    page: 1,
    sortBy: 'startTime',
    sortOrder: 'asc',
  });

  const allAppointments: Appointment[] = result.success && result.data ? result.data : [];

  // Filter for upcoming appointments (future appointments)
  const now = new Date();
  const appointments = allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return appointmentDate > now;
  }).slice(0, 5); // Take only first 5 upcoming appointments

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SCHEDULED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'NO_SHOW':
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
      default:
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />;
      case 'SCHEDULED':
        return <ClockIcon className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4" />;
      case 'NO_SHOW':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusPriority = (status: AppointmentStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'SCHEDULED':
        return 3;
      case 'COMPLETED':
        return 4;
      case 'CANCELLED':
        return 5;
      case 'NO_SHOW':
        return 6;
      default:
        return 7;
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

  // Sort appointments by priority and time
  const sortedAppointments = appointments.sort((a, b) => {
    const priorityDiff = getStatusPriority(a.status.name) - getStatusPriority(b.status.name);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rendez-vous à Venir</CardTitle>
            <CardDescription>Prochains rendez-vous programmés</CardDescription>
          </div>
          <Link 
            href="/admin/appointments" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Voir tout
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Aucun rendez-vous à venir</p>
            <p className="text-sm">Programmez des rendez-vous pour les voir ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
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
                      className={`text-xs border ${getStatusColor(appointment.status.name)}`}
                    >
                      {getStatusIcon(appointment.status.name)}
                      <span className="ml-1">{appointment.status.displayName}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {appointment.customer?.name || 'Client Inconnu'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDate(appointment.startTime)} à {formatTime(appointment.startTime)}
                    </span>
                  </div>
                  
                  {/* Status-specific information */}
                  {appointment.status.name === 'IN_PROGRESS' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-xs text-primary font-medium">En cours</span>
                    </div>
                  )}
                  
                  {appointment.status.name === 'CONFIRMED' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-emerald-600 font-medium">Confirmé</span>
                    </div>
                  )}
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