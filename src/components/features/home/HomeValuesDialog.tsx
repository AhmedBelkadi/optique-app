'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { HomeValues, HomeValuesFormData, homeValuesFormSchema } from '@/features/home/schema/homeValuesSchema';
import { createHomeValueAction, CreateHomeValueState } from '@/features/home/actions/createHomeValue';
import { updateHomeValueAction, UpdateHomeValueState } from '@/features/home/actions/updateHomeValue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCSRF } from '@/components/common/CSRFProvider';

interface HomeValuesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: HomeValues | null;
  onSuccess: (updatedValues: HomeValues[]) => void;
}

export default function HomeValuesDialog({
  open,
  onOpenChange,
  value,
  onSuccess,
}: HomeValuesDialogProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousCreateIsPending = useRef(false);
  const previousUpdateIsPending = useRef(false);
  const mode = value ? 'edit' : 'create';

  // Create action state
  const [createState, createFormAction, isCreatePending] = useActionState<CreateHomeValueState, FormData>(
    createHomeValueAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {
        title: '',
        description: '',
        highlight: '',
        icon: '',
        order: 0,
      },
      valueId: '',
    }
  );

  // Update action state
  const [updateState, updateFormAction, isUpdatePending] = useActionState<UpdateHomeValueState, FormData>(
    updateHomeValueAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {},
      valueId: '',
    }
  );

  const form = useForm<HomeValuesFormData>({
    resolver: zodResolver(homeValuesFormSchema),
    defaultValues: {
      title: '',
      description: '',
      highlight: '',
      icon: '',
      order: 0,
    } as HomeValuesFormData,
  });

  // Reset form when dialog opens/closes or value changes
  useEffect(() => {
    if (open) {
      if (value) {
        form.reset({
          title: value.title,
          description: value.description,
          highlight: value.highlight,
          icon: value.icon,
          order: value.order,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          highlight: '',
          icon: '',
          order: 0,
        });
      }
    }
  }, [open, value, form]);

  // Handle create success/error
  useEffect(() => {
    if (previousCreateIsPending.current && !isCreatePending) {
      if (createState.success) {
        toast.success('Valeur créée avec succès !');
        if (createState.data) {
          onSuccess(createState.data);
        } else {
          // Fallback to page refresh if no data returned
          window.location.reload();
        }
        onOpenChange(false);
      } else if (createState.error) {
        toast.error(createState.error || 'Échec de la création de la valeur');
      }
    }
    previousCreateIsPending.current = isCreatePending;
  }, [isCreatePending, createState.success, createState.error, createState.data, onSuccess, onOpenChange]);

  // Handle update success/error
  useEffect(() => {
    if (previousUpdateIsPending.current && !isUpdatePending) {
      if (updateState.success) {
        toast.success('Valeur mise à jour avec succès !');
        if (updateState.data) {
          onSuccess(updateState.data);
        } else {
          // Fallback to page refresh if no data returned
          window.location.reload();
        }
        onOpenChange(false);
      } else if (updateState.error) {
        toast.error(updateState.error || 'Échec de la mise à jour de la valeur');
      }
    }
    previousUpdateIsPending.current = isUpdatePending;
  }, [isUpdatePending, updateState.success, updateState.error, updateState.data, onSuccess, onOpenChange]);

  const handleSubmit = (data: HomeValuesFormData) => {
    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('highlight', data.highlight);
    formData.append('icon', data.icon);

    formData.append('order', (data.order || 0).toString());
    formData.append('csrf_token', csrfToken);

    if (mode === 'edit' && value) {
      formData.append('id', value.id);
      startTransition(() => {
        updateFormAction(formData);
      });
    } else {
      startTransition(() => {
        createFormAction(formData);
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  if (csrfLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 animate-spin mx-auto text-muted-foreground/60 border-2 border-primary border-t-transparent rounded-full" />
            <span className="ml-2 text-muted-foreground">Chargement du jeton de sécurité...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (csrfError || !csrfToken) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-8 h-8 mx-auto mb-4 text-red-500">🔒</div>
            <p className="text-muted-foreground mb-4">
              {csrfError ? 'Erreur lors du chargement du jeton de sécurité.' : 'Jeton de sécurité non disponible.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="default">
              Actualiser la page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 w-screen h-[100dvh] max-w-none mx-0 overflow-y-auto sm:w-[95vw] sm:max-w-lg sm:h-auto sm:max-h-[95vh] sm:mx-0">
        <DialogHeader className="sticky top-0 z-20 bg-background border-b px-4 py-3 sm:px-6">
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <Plus className="h-5 w-5" />
                Ajouter une nouvelle Valeur
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Modifier la Valeur
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6 px-4 py-4 sm:px-6 sm:py-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Ex: Qualité Premium"
              {...form.register('title')}
              className={form.formState.errors.title ? "border-destructive" : ""}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Icon Field */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icône *</Label>
            <Input
              id="icon"
              placeholder="Ex: Shield, Star, Heart"
              {...form.register('icon')}
              className={form.formState.errors.icon ? "border-destructive" : ""}
            />
            {form.formState.errors.icon && (
              <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Nom de l'icône Lucide (ex: Shield, Star, Heart, etc.)
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez cette valeur ou fonctionnalité..."
              rows={4}
              {...form.register('description')}
              className={form.formState.errors.description ? "border-destructive" : ""}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Highlight Field */}
          <div className="space-y-2">
            <Label htmlFor="highlight">Point Fort *</Label>
            <Input
              id="highlight"
              placeholder="Ex: Plus de 500 références"
              {...form.register('highlight')}
              className={form.formState.errors.highlight ? "border-destructive" : ""}
            />
            {form.formState.errors.highlight && (
              <p className="text-sm text-destructive">{form.formState.errors.highlight.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Un point clé ou statistique à mettre en avant
            </p>
          </div>

          {/* Active Status */}


          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aperçu</h3>
            
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {form.watch('title') || 'Titre de la valeur'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {form.watch('description') || 'Description de la valeur...'}
                  </p>
                  {form.watch('highlight') && (
                    <Badge variant="secondary" className="mt-2">
                      {form.watch('highlight')}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="default">
                    Actif
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-20 bg-background border-t px-4 py-3 sm:px-6 flex-col sm:flex-row gap-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isCreatePending || isUpdatePending}
              className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isCreatePending || isUpdatePending}
              className="w-full sm:w-auto"
            >
              {isCreatePending || isUpdatePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Création...' : 'Mise à jour...'}
                </>
              ) : (
                <>
                  {mode === 'create' ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer la Valeur
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Mettre à jour la Valeur
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
