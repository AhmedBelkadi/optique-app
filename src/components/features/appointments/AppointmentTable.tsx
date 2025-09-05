'use client';

import { useState } from 'react';
import { Edit, Trash2, RotateCcw, Eye, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Appointment, AppointmentStatus } from '@/features/appointments/schema/appointmentSchema';
import { softDeleteAppointmentAction } from '@/features/appointments/actions/softDeleteAppointment';
import { restoreAppointmentAction } from '@/features/appointments/actions/restoreAppointment';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface AppointmentTableProps {
  appointments: Appointment[];
  onDelete?: (appointmentId: string) => void;
  onUpdate?: (updatedAppointment: Appointment) => void;
}

const statusConfig = {
  SCHEDULED: { label: 'Scheduled', variant: 'secondary' as const },
  CONFIRMED: { label: 'Confirmed', variant: 'default' as const },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' as const },
  COMPLETED: { label: 'Completed', variant: 'default' as const },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
  NO_SHOW: { label: 'No Show', variant: 'destructive' as const },
};

export default function AppointmentTable({ appointments, onDelete, onUpdate }: AppointmentTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsLoading(id);
    try {
      const result = await softDeleteAppointmentAction({}, new FormData());
      if (result.success) {
        toast.success('Appointment deleted successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onDelete?.(id);
      } else {
        toast.error(result.error || 'Failed to delete appointment', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      toast.error('Failed to delete appointment', {
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } finally { 
      setIsLoading(null);
    }
  };

  const handleRestore = async (id: string) => {
    setIsLoading(id);
    try {
      const result = await restoreAppointmentAction({}, new FormData());
      if (result.success) {
        toast.success('Appointment restored successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onUpdate?.(appointments.find(a => a.id === id)!);
      } else {
        toast.error(result.error || 'Failed to restore appointment', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      toast.error('Failed to restore appointment', {
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } finally {
      setIsLoading(null);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const getStatusBadge = (status: { name: string; displayName: string; color: string }) => {
    const config = statusConfig[status.name as keyof typeof statusConfig];
    if (!config) {
      return <Badge variant="secondary">{status.displayName}</Badge>;
    }
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const startTime = new Date(appointment.startTime);
            const endTime = new Date(appointment.endTime);
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const durationText = durationHours > 0 
              ? `${durationHours}h ${durationMinutes}m`
              : `${durationMinutes}m`;

            return (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.title}</div>
                    {appointment.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {appointment.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.customer?.name}</div>
                    <div className="text-sm text-muted-foreground">{appointment.customer?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1 text-muted-foreground/60" />
                      {formatDateTime(startTime)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(startTime)} - {formatTime(endTime)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{durationText}</Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(appointment.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/appointments/${appointment.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/appointments/${appointment.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Appointment
                        </Link>
                      </DropdownMenuItem>
                      {appointment.isDeleted ? (
                        <DropdownMenuItem
                          onClick={() => handleRestore(appointment.id)}
                          disabled={isLoading === appointment.id}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleDelete(appointment.id)}
                          disabled={isLoading === appointment.id}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 