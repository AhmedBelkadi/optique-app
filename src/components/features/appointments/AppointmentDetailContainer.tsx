'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Edit, ArrowLeft, MapPin, Phone, Mail, Trash2, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { changeAppointmentStatusAction } from '@/features/appointments/actions/changeAppointmentStatusAction';
import { deleteAppointmentAction } from '@/features/appointments/actions/deleteAppointmentAction';
import { useCSRF } from '@/components/common/CSRFProvider';

interface AppointmentStatus {
  id: string;
  name: string;
  displayName: string;
  color: string;
  description: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  customer: Customer;
  status: AppointmentStatus;
}

interface AppointmentDetailContainerProps {
  appointment: Appointment;
  appointmentStatuses: AppointmentStatus[];
}

export default function AppointmentDetailContainer({ appointment, appointmentStatuses }: AppointmentDetailContainerProps) {
  const router = useRouter();
  const { csrfToken } = useCSRF();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(appointment.status.id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const calculateDuration = () => {
    try {
      const startTime = new Date(appointment.startTime);
      const endTime = new Date(appointment.endTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (durationHours > 0) {
        return `${durationHours}h ${durationMinutes}m`;
      }
      return `${durationMinutes}m`;
    } catch {
      return 'N/A';
    }
  };

  const handleStatusChange = async () => {
    if (selectedStatusId === appointment.status.id) return;

    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setIsChangingStatus(true);
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointment.id);
      formData.append('statusId', selectedStatusId);
      formData.append('csrf_token', csrfToken);

      const result = await changeAppointmentStatusAction({}, formData);
      
      if (result.success) {
        toast.success('Statut mis à jour avec succès');
        router.refresh();
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async (permanent: boolean = false) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointment.id);
      formData.append('permanent', permanent.toString());
      formData.append('csrf_token', csrfToken);

      const result = await deleteAppointmentAction({}, formData);
      
      if (result.success) {
        toast.success(result.message || 'Rendez-vous supprimé avec succès');
        setIsDeleteDialogOpen(false);
        if (permanent) {
          router.push('/admin/appointments');
        } else {
          router.push('/admin/appointments/trash');
        }
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName) {
      case 'scheduled': return 'default';
      case 'confirmed': return 'secondary';
      case 'in-progress': return 'outline';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/appointments">
            <Button variant="default" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux rendez-vous
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{appointment.title}</h1>
            <p className="text-muted-foreground mt-1">Détails du rendez-vous</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/appointments/${appointment.id}/edit`}>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du rendez-vous</CardTitle>
              <CardDescription>
                Détails sur ce rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date & Heure
                  </div>
                  <p className="font-medium">{formatDateTime(appointment.startTime)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Durée
                  </div>
                  <p className="font-medium">{calculateDuration()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  Plage horaire
                </div>
                <p className="font-medium">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
              </div>

              {appointment.description && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <p className="text-foreground">{appointment.description}</p>
                </div>
              )}

              {appointment.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <p className="text-foreground whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du client</CardTitle>
              <CardDescription>
                Détails sur le client pour ce rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground/60" />
                <div>
                  <h4 className="font-medium">{appointment.customer.name}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.customer.email}</p>
                </div>
              </div>

              {appointment.customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground/60" />
                  <span className="text-sm">{appointment.customer.phone}</span>
                </div>
              )}

              {appointment.customer.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Notes client</div>
                  <p className="text-sm text-foreground">{appointment.customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
              <CardDescription>
                Gérer le statut du rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={getStatusBadgeVariant(appointment.status.name)}
                  style={{ backgroundColor: appointment.status.color + '20', color: appointment.status.color }}
                >
                  {appointment.status.displayName}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          {status.displayName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleStatusChange} 
                  disabled={isChangingStatus || selectedStatusId === appointment.status.id}
                  className="w-full"
                >
                  {isChangingStatus ? (
                    <>Mise à jour...</>
                  ) : (
                    <>Mettre à jour le statut</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Horodatage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Créé le
                </div>
                <p className="text-sm">{formatDateTime(appointment.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Dernière mise à jour
                </div>
                <p className="text-sm">{formatDateTime(appointment.updatedAt)}</p>
              </div>
              {appointment.deletedAt && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Supprimé le
                  </div>
                  <p className="text-sm">{formatDateTime(appointment.deletedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/admin/customers/${appointment.customer.id}`}>
                <Button variant="default" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Voir le client
                </Button>
              </Link>
              <Link href={`/admin/appointments/${appointment.id}/edit`}>
                <Button variant="default" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le rendez-vous
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action le déplacera vers la corbeille.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-3">
                    <Button variant="default" onClick={() => setIsDeleteDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDelete(false)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
