'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { createServiceAction, CreateServiceState } from '@/features/services/actions/createServiceAction';
import { updateServiceAction, UpdateServiceState } from '@/features/services/actions/updateServiceAction';
import { createServiceSchema, updateServiceSchema, Service } from '@/features/services/schema/serviceSchema';
import { useCSRF } from '@/components/common/CSRFProvider';
import { toast } from 'react-hot-toast';

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
  onServiceCreated?: (service: Service) => void;
  onServiceUpdated?: (service: Service) => void;
}

const commonIcons = [
  'Eye', 'Glasses', 'Circle', 'Wrench', 'Sun', 'Calendar', 'Heart', 'Shield',
  'Star', 'CheckCircle', 'Zap', 'Target', 'MapPin', 'TrendingUp', 'Award',
  'Users', 'Clock', 'Phone', 'Mail', 'MessageSquare'
];

export function ServiceForm({ service, onSuccess, onServiceCreated, onServiceUpdated }: ServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const isEditing = !!service;

  const [state, formAction, isPending] = useActionState(
    isEditing ? updateServiceAction.bind(null, service!.id) : createServiceAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {
        name: service?.name || '',
        description: service?.description || '',
        icon: service?.icon || '',
        isActive: service?.isActive ?? true,
        order: service?.order || 0,
      },
    }
  );

  const form = useForm({
    resolver: zodResolver(isEditing ? updateServiceSchema : createServiceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      icon: service?.icon || '',
      isActive: service?.isActive ?? true,
      order: service?.order || 0,
    },
  });

  // Handle action completion
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success(isEditing ? 'Service mis à jour avec succès !' : 'Service créé avec succès !');
        
        form.reset();
        setIsOpen(false);
        onSuccess?.();
        
        // Call the appropriate callback
        if (isEditing && service && state.data) {
          onServiceUpdated?.(state.data);
        } else if (!isEditing && state.data) {
          onServiceCreated?.(state.data);
        }
      } else if (state.error) {
        toast.error(state.error || (isEditing ? 'Échec de la mise à jour du service' : 'Échec de la création du service'));
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess, onServiceCreated, onServiceUpdated, isEditing, service, state.data, form]);

  const handleSubmit = (data: any) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('icon', data.icon || '');
    formData.append('isActive', data.isActive.toString());
    formData.append('order', data.order.toString());
    formData.append('csrf_token', csrfToken);

    formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "outline" : "default"} size="sm">
          {isEditing ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Service
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le Service' : 'Ajouter un Nouveau Service'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Service *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Examens de la Vue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d'Affichage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée du service..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icône (Nom Lucide)</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Ex: Eye, Glasses, Circle..."
                        {...field}
                      />
                      <div className="flex flex-wrap gap-2">
                        {commonIcons.map((icon) => (
                          <Button
                            key={icon}
                            type="button"
                            variant={field.value === icon ? "default" : "outline"}
                            size="sm"
                            onClick={() => field.onChange(icon)}
                            className="text-xs"
                          >
                            {icon}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Service Actif
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Le service sera visible sur le site public
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}