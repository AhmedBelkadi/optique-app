'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User,  AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { createAppointmentAction } from '@/features/appointments/actions/createAppointmentAction';
import { getAppointmentStatusesAction } from '@/features/appointments/actions/getAppointmentStatusesAction';
import CustomerSelector from './CustomerSelector';

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
  phone: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentCreateFormProps {
  onCreate: (formData: any) => void;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
}

// Form validation schema
const appointmentCreateSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  appointmentDate: z.string().min(1, 'La date est requise'),
  appointmentTime: z.string().min(1, 'L\'heure est requise'),
  duration: z.number().int().min(15, 'La durée minimale est de 15 minutes').max(480, 'La durée maximale est de 8 heures'),
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
  // Customer fields are optional when using CustomerSelector
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères').optional(),
  customerPhone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres').max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres').optional(),
  customerEmail: z.string().email('L\'email doit être valide').max(100, 'L\'email ne peut pas dépasser 100 caractères').optional(),
  customerNotes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
});

type AppointmentCreateFormData = z.infer<typeof appointmentCreateSchema>;

export default function AppointmentCreateForm({ onCreate, isCreating, setIsCreating }: AppointmentCreateFormProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  
  // Customer selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerMode, setCustomerMode] = useState<'select' | 'create'>('select');

  // Initialize form with default values
  const form = useForm<AppointmentCreateFormData>({
    resolver: zodResolver(appointmentCreateSchema),
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
  };

  const handleBackToSelect = () => {
    setCustomerMode('select');
    setSelectedCustomer(null);
    // Clear customer fields
    form.setValue('customerName', '');
    form.setValue('customerEmail', '');
    form.setValue('customerPhone', '');
    form.setValue('customerNotes', '');
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
      }

      // Validate required appointment fields
      if (!data.title || !data.appointmentDate || !data.appointmentTime || !data.duration) {
        toast.error('Veuillez remplir tous les champs obligatoires du rendez-vous');
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
        
        // Appointment data
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        duration: data.duration,
        reason: data.title,
        notes: data.notes,
      };

      const result = await createAppointmentAction(createData);
      
      if (result.success) {
        toast.success('Rendez-vous créé avec succès');
        // Call the parent's onCreate callback
        onCreate(createData);
        router.push('/admin/appointments');
      } else {
        toast.error(result.error || 'Erreur lors de la création');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Erreur lors de la création du rendez-vous');
      setIsCreating(false);
    }
  };

  return (
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


    </form>
  );
}
