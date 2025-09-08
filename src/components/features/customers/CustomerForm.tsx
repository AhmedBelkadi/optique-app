'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Loader2, X, Edit } from 'lucide-react';
import { createCustomerAction } from '@/features/customers/actions/createCustomer';
import { updateCustomerAction } from '@/features/customers/actions/updateCustomer';
import { Customer } from '@/features/customers/schema/customerSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';

interface CustomerFormProps {
  mode: 'create' | 'edit';
  customer?: Customer; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom doit contenir moins de 100 caractères'),
  email: z.string().email('Adresse email invalide').max(100, 'L\'email doit contenir moins de 100 caractères'),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomerForm({ mode, customer }: CustomerFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    // Clear previous errors
    setFieldErrors({});
    setGeneralError('');

    startTransition(async () => {
      try {
        // Create FormData with all the form values
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);
        if (data.address) formData.append('address', data.address);
        if (data.notes) formData.append('notes', data.notes);
        
        // Add CSRF token
        formData.append('csrf_token', csrfToken);
        
        // Add customerId for edit mode
        if (mode === 'edit' && customer) {
          formData.append('customerId', customer.id);
        }

        let result;
        
        if (mode === 'edit' && customer) {
          result = await updateCustomerAction(null, formData);
        } else {
          result = await createCustomerAction(null, formData);
        }

        if (result.success) {
          const message = mode === 'create' ? 'Client créé avec succès !' : 'Client mis à jour avec succès !';
          toast.success(message, {
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          });
          router.push('/admin/customers');
        } else {
          const errorMessage = result.error || `Échec de la ${mode === 'create' ? 'création' : 'mise à jour'} du client`;
          setGeneralError(errorMessage);
          
          // Handle field errors if present
          if (result.fieldErrors) {
            // Convert array errors to single strings for display
            const processedErrors: Record<string, string> = {};
            Object.entries(result.fieldErrors).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                processedErrors[key] = value[0];
              }
            });
            setFieldErrors(processedErrors);
          }
          
          toast.error(errorMessage, {
            icon: '❌',
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
        setGeneralError(errorMessage);
        toast.error(errorMessage, {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    });
  };

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      // Handle any post-submission logic here if needed
    }
    previousIsPending.current = isPending;
  }, [isPending]);

  if (csrfLoading) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Erreur lors du chargement du jeton de sécurité. Veuillez actualiser la page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-muted-foreground">Jeton de sécurité non disponible. Veuillez actualiser la page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              {mode === 'create' ? (
                <Plus className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Edit className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
            <span>{mode === 'create' ? 'Informations du Client' : 'Modifier les Informations du Client'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Nom du Client *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrez le nom du client"
                          className={`transition-all duration-200 ${
                            fieldErrors.name 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.name && (
                          <span className="inline-flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            <span>{fieldErrors.name}</span>
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Adresse Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Entrez l'adresse email"
                          className={`transition-all duration-200 ${
                            fieldErrors.email 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.email && (
                          <span className="inline-flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            <span>{fieldErrors.email}</span>
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Numéro de Téléphone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrez le numéro de téléphone"
                          className={`transition-all duration-200 ${
                            fieldErrors.phone 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.phone && (
                          <span className="inline-flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            <span>{fieldErrors.phone}</span>
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrez l'adresse du client"
                          className={`transition-all duration-200 ${
                            fieldErrors.address 
                              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.address && (
                          <span className="inline-flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            <span>{fieldErrors.address}</span>
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Entrez des notes supplémentaires sur le client"
                        rows={4}
                        className={`transition-all duration-200 resize-none ${
                          fieldErrors.notes 
                            ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldErrors.notes && (
                        <span className="inline-flex items-center text-destructive">
                          <X className="w-4 h-4 mr-1" />
                          <span>{fieldErrors.notes}</span>
                        </span>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {generalError && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center text-destructive">
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{generalError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                  >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Création...' : 'Mise à jour...'}
                    </>
                  ) : (
                    <>
                      {mode === 'create' ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Créer le Client
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Mettre à Jour le Client
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 