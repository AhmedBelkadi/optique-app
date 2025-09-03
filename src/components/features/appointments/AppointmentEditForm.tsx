'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { updateAppointmentAction } from '@/features/appointments/actions/updateAppointmentAction';
import { getAppointmentStatusesAction } from '@/features/appointments/actions/getAppointmentStatusesAction';

interface AppointmentStatus {
  id: string;
  name: string;
  displayName: string;
  color: string;
  description?: string | null;
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
  customer: Customer;
  status: AppointmentStatus;
}

interface AppointmentEditFormProps {
  appointment: Appointment;
  onSave: (formData: any) => void;
  isSaving: boolean;
}

// Form validation schema
const appointmentEditSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  appointmentDate: z.string().min(1, 'La date est requise'),
  appointmentTime: z.string().min(1, 'L\'heure est requise'),
  duration: z.number().int().min(15, 'La durée minimale est de 15 minutes').max(480, 'La durée maximale est de 8 heures'),
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  customerPhone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres').max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres'),
  customerEmail: z.string().email('L\'email doit être valide').max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  customerNotes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
});

type AppointmentEditFormData = z.infer<typeof appointmentEditSchema>;

export default function AppointmentEditForm({ appointment, onSave, isSaving }: AppointmentEditFormProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState(appointment.status.id);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);

  // Initialize form with appointment data
  const form = useForm<AppointmentEditFormData>({
    resolver: zodResolver(appointmentEditSchema),
    defaultValues: {
      title: appointment.title,
      description: appointment.description || '',
      appointmentDate: new Date(appointment.startTime).toISOString().split('T')[0],
      appointmentTime: new Date(appointment.startTime).toISOString().split('T')[1].substring(0, 5),
      duration: Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60)),
      notes: appointment.notes || '',
      customerName: appointment.customer.name,
      customerPhone: appointment.customer.phone,
      customerEmail: appointment.customer.email,
      customerNotes: appointment.customer.notes || '',
    }
  });

  // Load appointment statuses
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const result = await getAppointmentStatusesAction();
        if (result.success && result.data) {
          setStatuses(result.data);
        }
      } catch (error) {
        console.error('Error loading statuses:', error);
      } finally {
        setIsLoadingStatuses(false);
      }
    };

    loadStatuses();
  }, []);

  const onSubmit = async (data: AppointmentEditFormData) => {
    try {
      // Set loading state
      onSave(data);

      // Prepare data for update
      const updateData = {
        title: data.title,
        description: data.description,
        startTime: `${data.appointmentDate}T${data.appointmentTime}`,
        duration: data.duration,
        notes: data.notes,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerNotes: data.customerNotes,
        statusId: selectedStatusId,
      };

      const result = await updateAppointmentAction(appointment.id, updateData);
      
      if (result.success) {
        toast.success('Rendez-vous mis à jour avec succès');
        router.push(`/admin/appointments/${appointment.id}`);
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <form id="appointment-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Appointment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations du rendez-vous
          </CardTitle>
          <CardDescription>
            Modifiez les détails et la planification du rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rendez-vous *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Ex: Consultation optique"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                {...form.register('duration', { valueAsNumber: true })}
                min="15"
                max="480"
                step="15"
              />
              {form.formState.errors.duration && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                {...form.register('appointmentDate')}
              />
              {form.formState.errors.appointmentDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.appointmentDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Heure *</Label>
              <Input
                id="appointmentTime"
                type="time"
                {...form.register('appointmentTime')}
              />
              {form.formState.errors.appointmentTime && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.appointmentTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Description du rendez-vous (optionnel)"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Notes internes pour l'équipe (optionnel)"
              rows={3}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.notes.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du client
          </CardTitle>
          <CardDescription>
            Modifiez les informations de contact du client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nom complet *</Label>
              <Input
                id="customerName"
                {...form.register('customerName')}
                placeholder="Nom et prénom du client"
              />
              {form.formState.errors.customerName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.customerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Téléphone *</Label>
              <Input
                id="customerPhone"
                {...form.register('customerPhone')}
                placeholder="+XXX XX XX XX XX"
              />
              {form.formState.errors.customerPhone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.customerPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              {...form.register('customerEmail')}
              placeholder="client@email.com"
            />
            {form.formState.errors.customerEmail && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.customerEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Notes client</Label>
            <Textarea
              id="customerNotes"
              {...form.register('customerNotes')}
              placeholder="Informations supplémentaires sur le client (optionnel)"
              rows={3}
            />
            {form.formState.errors.customerNotes && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.customerNotes.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Gestion du statut
          </CardTitle>
          <CardDescription>
            Modifiez le statut du rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut actuel</Label>
            <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut">
                  {statuses.find(s => s.id === selectedStatusId)?.displayName || "Sélectionner un statut"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {isLoadingStatuses ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : (
                  statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        {status.displayName}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Appointment Info */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Informations actuelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Statut actuel:</span>
            <span className="font-medium">{appointment.status.displayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Créé le:</span>
            <span>{formatDateTime(appointment.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dernière mise à jour:</span>
            <span>{formatDateTime(appointment.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
