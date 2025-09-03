'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Loader2, X, Edit, Star } from 'lucide-react';
import { createTestimonialAction } from '@/features/testimonials/actions/createTestimonial';
import { updateTestimonialAction } from '@/features/testimonials/actions/updateTestimonial';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TestimonialImageUpload from './TestimonialImageUpload';
import { useCSRF } from '@/components/common/CSRFProvider';

interface TestimonialFormProps {
  mode: 'create' | 'edit';
  testimonial?: Testimonial; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  rating: z.number().min(1, 'La note doit être comprise entre 1 et 5').max(5, 'La note doit être comprise entre 1 et 5'),
  source: z.enum(['internal', 'facebook', 'google', 'trustpilot']),
  externalId: z.string().optional(),
  externalUrl: z.string().url('L\'URL externe doit être valide').optional().or(z.literal('')),
  title: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function TestimonialForm({ mode, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial?.name || '',
      message: testimonial?.message || '',
      rating: testimonial?.rating || 5,
      source: testimonial?.source || 'internal',
      externalId: testimonial?.externalId || '',
      externalUrl: testimonial?.externalUrl || '',
      title: testimonial?.title || '',
      image: testimonial?.image || '',
      isActive: testimonial?.isActive ?? true,
      isVerified: testimonial?.isVerified ?? false,
    },
  });

  // Handle form errors from server action
  useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      Object.entries(fieldErrors).forEach(([field, error]) => {
        if (error) {
          form.setError(field as keyof FormData, {
            type: 'server',
            message: error,
          });
        }
      });
    }
  }, [fieldErrors, form]);

  // Handle general error
  useEffect(() => {
    if (generalError) {
      toast.error(generalError);
    }
  }, [generalError]);

  // Show loading state
  useEffect(() => {
    if (isPending && !previousIsPending.current) {
      toast.loading('Enregistrement en cours...', { id: 'form-submit' });
    } else if (!isPending && previousIsPending.current) {
      toast.dismiss('form-submit');
    }
    previousIsPending.current = isPending;
  }, [isPending]);

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
        // Create FormData for server action
        const formData = new FormData();
        formData.append('csrf_token', csrfToken);
        
        // Add form fields
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value.toString());
          }
        });

        // Add ID for edit mode
        if (mode === 'edit' && testimonial) {
          formData.append('id', testimonial.id);
        }

        let result;
        
        if (mode === 'edit' && testimonial) {
          result = await updateTestimonialAction(null, formData);
        } else {
          result = await createTestimonialAction(null, formData);
        }

        if (result.success) {
          const message = mode === 'create' ? 'Témoignage créé avec succès !' : 'Témoignage mis à jour avec succès !';
          toast.success(message, {
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          });

          // Redirect to testimonials list
          router.push('/admin/testimonials');
        } else {
          // Handle validation errors
          if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
            setFieldErrors(result.fieldErrors);
          }
          
          // Handle general error
          if (result.error) {
            setGeneralError(result.error);
            toast.error(result.error);
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error('Une erreur inattendue est survenue');
      }
    });
  };

  // Render loading state
  if (csrfLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement du jeton de sécurité...</span>
      </div>
    );
  }

  // Render error state
  if (csrfError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <X className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Erreur du jeton de sécurité</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {mode === 'create' ? (
                <>
                  <Plus className="h-5 w-5" />
                  Créer un témoignage
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5" />
                  Modifier le témoignage
                </>
              )}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du client *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <SelectItem key={rating} value={rating.toString()}>
                                  <div className="flex items-center gap-2">
                                    {rating} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">sur 5</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Message du témoignage..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Source Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Interne</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="trustpilot">Trustpilot</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Titre du témoignage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* External Source Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="externalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID externe (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="ID de la plateforme externe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL externe (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image */}
              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (optionnel)</FormLabel>
                  <FormControl>
                    <TestimonialImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Status Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Actif</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Le témoignage sera visible sur le site
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Vérifié</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Marquer comme vérifié
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'create' ? 'Créer' : 'Mettre à jour'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
  );
} 