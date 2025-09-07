'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, AlertCircle, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { createAppointmentAction } from '@/features/appointments/actions/createAppointmentAction';
import { getAppointmentStatusesAction } from '@/features/appointments/actions/getAppointmentStatusesAction';
import CustomerSelector from './CustomerSelector';
import { useCSRF } from '@/components/common/CSRFProvider';
import { checkAppointmentAvailabilityAction } from '@/features/appointments/actions/checkAppointmentAvailabilityAction';
import type { AvailabilityCheckResult } from '@/features/appointments/services/checkAppointmentAvailability';
import { AppointmentStatus, Customer, AppointmentFormValidation } from '@/features/appointments/types';
import { createAppointmentSchema } from '@/features/appointments/utils/validation';

// Types are now imported from shared types file

interface AppointmentCreateFormProps {
  onCreate: (formData: any) => void;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
}

// Use shared validation schema
type AppointmentCreateFormData = z.infer<typeof createAppointmentSchema>;

export default function AppointmentCreateForm({ onCreate, isCreating, setIsCreating }: AppointmentCreateFormProps) {
  const router = useRouter();
  const { csrfToken } = useCSRF();
  const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  
  // Customer selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerMode, setCustomerMode] = useState<'select' | 'create'>('select');
  
  // Availability checking state
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityCheckResult | null>(null);

  // Initialize form with default values
  const form = useForm<AppointmentCreateFormData>({
    resolver: zodResolver(createAppointmentSchema),
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      title: '',
      description: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 60,
      notes: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerNotes: '',
    }
  });

  // Load appointment statuses
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const result = await getAppointmentStatusesAction();
        if (result.success && result.data) {
          setStatuses(result.data);
          // Set default status to 'scheduled' if available
          const scheduledStatus = result.data.find(s => s.name === 'scheduled');
          if (scheduledStatus) {
            setSelectedStatusId(scheduledStatus.id);
          }
        }
      } catch (error) {
        console.error('Error loading statuses:', error);
      } finally {
        setIsLoadingStatuses(false);
      }
    };

    loadStatuses();
  }, []);

  // Real-time availability checking
  const checkAvailability = async (date: string, time: string, duration: number) => {
    if (!date || !time || !duration) {
      setAvailabilityStatus(null);
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      const result = await checkAppointmentAvailabilityAction(
        startTime.toISOString(),
        endTime.toISOString()
      );
      
      if (result.success && result.data) {
        setAvailabilityStatus(result.data!);
      } else {
        setAvailabilityStatus({
          isAvailable: false,
          error: result.error || 'Erreur lors de la vérification de disponibilité'
        } as AvailabilityCheckResult);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityStatus({
        isAvailable: false,
        error: 'Erreur lors de la vérification de disponibilité'
      } as AvailabilityCheckResult);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Watch form fields for real-time availability checking
  const watchedDate = form.watch('appointmentDate');
  const watchedTime = form.watch('appointmentTime');
  const watchedDuration = form.watch('duration');

  useEffect(() => {
    if (watchedDate && watchedTime && watchedDuration) {
      const timeoutId = setTimeout(() => {
        checkAvailability(watchedDate, watchedTime, watchedDuration);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedDate, watchedTime, watchedDuration]);

  // Customer selection handlers
  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      // Pre-fill form with customer data
      form.setValue('customerName', customer.name);
      form.setValue('customerEmail', customer.email);
      form.setValue('customerPhone', customer.phone || '');
      form.setValue('customerNotes', customer.notes || undefined);
    }
  };

  const handleCreateNewCustomer = () => {
    setCustomerMode('create');
    setSelectedCustomer(null);
    // Clear customer fields
    form.setValue('customerName', '');
    form.setValue('customerEmail', '');
    form.setValue('customerPhone', '');
    form.setValue('customerNotes', '');
    // Clear any validation errors
    form.clearErrors(['customerName', 'customerEmail', 'customerPhone', 'customerNotes']);
  };

  const handleBackToSelect = () => {
    setCustomerMode('select');
    setSelectedCustomer(null);
    // Clear customer fields
    form.setValue('customerName', '');
    form.setValue('customerEmail', '');
    form.setValue('customerPhone', '');
    form.setValue('customerNotes', '');
    // Clear any validation errors
    form.clearErrors(['customerName', 'customerEmail', 'customerPhone', 'customerNotes']);
  };

  const onSubmit = async (data: AppointmentCreateFormData) => {
    try {
      // Set loading state
      setIsCreating(true);

      // Validate customer data based on mode
      if (customerMode === 'select' && !selectedCustomer) {
        toast.error('Veuillez sélectionner un client ou créer un nouveau client');
        setIsCreating(false);
        return;
      }

      if (customerMode === 'create') {
        // Validate required customer fields for new customer
        if (!data.customerName || !data.customerEmail || !data.customerPhone) {
          toast.error('Veuillez remplir tous les champs obligatoires du client');
          setIsCreating(false);
          return;
        }
        
        // Additional validation for new customer
        if (data.customerName.length < 2) {
          toast.error('Le nom du client doit contenir au moins 2 caractères');
          setIsCreating(false);
          return;
        }
        
        if (data.customerPhone.length < 10) {
          toast.error('Le numéro de téléphone doit contenir au moins 10 chiffres');
          setIsCreating(false);
          return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.customerEmail)) {
          toast.error('Veuillez entrer une adresse email valide');
          setIsCreating(false);
          return;
        }
      }

      // Validate required appointment fields
      if (!data.title || !data.appointmentDate || !data.appointmentTime || !data.duration) {
        toast.error('Veuillez remplir tous les champs obligatoires du rendez-vous');
        setIsCreating(false);
        return;
      }

      // Combine date and time into ISO string
      const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
      
      // Validate business hours
      const [hours, minutes] = data.appointmentTime.split(':').map(Number);
      const dayOfWeek = appointmentDateTime.getDay();
      
      // Check if it's Sunday
      if (dayOfWeek === 0) {
        toast.error('Les rendez-vous ne sont pas disponibles le dimanche');
        form.setError('appointmentTime', {
          type: 'manual',
          message: 'Les rendez-vous ne sont pas disponibles le dimanche'
        });
        setIsCreating(false);
        return;
      }
      
      // Check business hours (9:00 AM to 7:00 PM)
      if (hours < 9 || hours >= 19) {
        toast.error('Les rendez-vous ne sont disponibles que de 9h00 à 19h00');
        form.setError('appointmentTime', {
          type: 'manual',
          message: 'Les rendez-vous ne sont disponibles que de 9h00 à 19h00'
        });
        setIsCreating(false);
        return;
      }
      
      // Check if appointment is at least 30 minutes before closing
      if (hours === 18 && minutes > 30) {
        toast.error('Le dernier rendez-vous possible est à 18h30');
        form.setError('appointmentTime', {
          type: 'manual',
          message: 'Le dernier rendez-vous possible est à 18h30'
        });
        setIsCreating(false);
        return;
      }
      
      // Check if appointment is in the past
      if (appointmentDateTime < new Date()) {
        toast.error('La date de rendez-vous ne peut pas être dans le passé');
        form.setError('appointmentDate', {
          type: 'manual',
          message: 'La date de rendez-vous ne peut pas être dans le passé'
        });
        setIsCreating(false);
        return;
      }

      // Check availability before submission
      if (availabilityStatus && !availabilityStatus.isAvailable) {
        toast.error('Ce créneau n\'est pas disponible. Veuillez choisir un autre horaire.');
        form.setError('appointmentTime', {
          type: 'manual',
          message: 'Ce créneau n\'est pas disponible. Veuillez choisir un autre horaire.'
        });
        setIsCreating(false);
        return;
      }

      // Prepare data for creation
      const createData = {
        // Customer data
        customerId: selectedCustomer?.id, // Pass customer ID if selected
        customerName: data.customerName || selectedCustomer?.name || '',
        customerPhone: data.customerPhone || selectedCustomer?.phone || '',
        customerEmail: data.customerEmail || selectedCustomer?.email || '',
        customerNotes: data.customerNotes || (selectedCustomer?.notes ? selectedCustomer.notes : undefined),
        
        // Appointment data - combine date and time
        appointmentDate: appointmentDateTime.toISOString(),
        appointmentTime: data.appointmentTime,
        duration: data.duration,
        reason: data.title,
        notes: data.notes,
        ...(csrfToken && { csrf_token: csrfToken }), // Add CSRF token only if available
      };

      const result = await createAppointmentAction(createData);
      
      if (result.success) {
        toast.success(result.message || 'Rendez-vous créé avec succès');
        // Call the parent's onCreate callback
        onCreate(createData);
        router.push('/admin/appointments');
      } else {
        toast.error(result.error || 'Erreur lors de la création du rendez-vous');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Erreur lors de la création du rendez-vous');
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du rendez-vous</CardTitle>
        <CardDescription>
          Remplissez les détails du rendez-vous et les informations du client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          id="appointment-create-form" 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          autoComplete="off"
        >
      {/* Appointment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations du rendez-vous
          </CardTitle>
          <CardDescription>
            Remplissez les détails et la planification du rendez-vous
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

          {/* Availability Status */}
          {availabilityStatus && (
            <div className="space-y-2">
              {isCheckingAvailability ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Vérification de la disponibilité...
                </div>
              ) : availabilityStatus.isAvailable ? (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ✅ Ce créneau est disponible
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    ❌ Ce créneau n'est pas disponible
                  </div>
                  {availabilityStatus.conflicts && availabilityStatus.conflicts.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-4">
                      <p className="font-medium mb-1">Conflits détectés :</p>
                      {availabilityStatus.conflicts.map((conflict, index) => (
                        <p key={index} className="mb-1">
                          • {conflict.customerName} ({new Date(conflict.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(conflict.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
            {customerMode === 'select' 
              ? 'Sélectionnez un client existant ou créez un nouveau client'
              : 'Remplissez les informations du nouveau client'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="select-mode"
                name="customer-mode"
                checked={customerMode === 'select'}
                onChange={() => setCustomerMode('select')}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="select-mode" className="text-sm font-medium">
                Sélectionner un client existant
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="create-mode"
                name="customer-mode"
                checked={customerMode === 'create'}
                onChange={() => setCustomerMode('create')}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="create-mode" className="text-sm font-medium">
                Créer un nouveau client
              </Label>
            </div>
          </div>

          {/* Customer Selector or Form */}
          {customerMode === 'select' ? (
            <CustomerSelector
              onCustomerSelect={handleCustomerSelect}
              onCreateNew={handleCreateNewCustomer}
              selectedCustomer={selectedCustomer}
              disabled={isCreating}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Nouveau client</h4>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleBackToSelect}
                >
                  ← Retour à la sélection
                </Button>
              </div>
              
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Preview */}
      {watchedDate && watchedTime && watchedDuration && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Aperçu du rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">📅 Date & Heure</p>
                <p>{new Date(`${watchedDate}T${watchedTime}`).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} à {watchedTime}</p>
              </div>
              <div>
                <p className="font-medium">⏱️ Durée</p>
                <p>{watchedDuration} minutes</p>
              </div>
              <div>
                <p className="font-medium">👤 Client</p>
                <p>{selectedCustomer ? selectedCustomer.name : (form.watch('customerName') || 'Nouveau client')}</p>
              </div>
              <div>
                <p className="font-medium">📋 Motif</p>
                <p>{form.watch('title') || 'Non spécifié'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Hours Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>• Les rendez-vous sont disponibles du lundi au samedi, de 9h00 à 19h00</p>
          <p>• La durée minimale est de 15 minutes et maximale de 8 heures</p>
          <p>• Le système vérifiera automatiquement les conflits d'horaires</p>
          <p>• Une confirmation sera envoyée par WhatsApp dans les 24h</p>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6">
        <Link href="/admin/appointments">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
          >
            Annuler
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={isCreating || (availabilityStatus && !availabilityStatus.isAvailable) || isCheckingAvailability}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Création...' : 
           isCheckingAvailability ? 'Vérification...' :
           (availabilityStatus && !availabilityStatus.isAvailable) ? 'Créneau indisponible' :
           'Créer le rendez-vous'}
        </Button>
      </div>
    </form>
      </CardContent>
    </Card>
  );
}
