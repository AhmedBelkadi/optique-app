'use client';

import { useState, useTransition, useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  Loader2, 
  Wrench,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Shield,
  Settings
} from 'lucide-react';
import { updateMaintenanceModeAction } from '@/features/settings/actions';
import { SettingsWithTimestamps } from '@/features/settings/schema/settingsSchema';
import { useCSRF } from '@/components/common/CSRFProvider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const operationsFormSchema = z.object({
  maintenanceMode: z.boolean(),
});

type OperationsFormData = z.infer<typeof operationsFormSchema>;

interface OperationsSettingsFormProps {
  settings: SettingsWithTimestamps;
}

export default function OperationsSettingsForm({ settings }: OperationsSettingsFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(updateMaintenanceModeAction, {
    success: false,
    error: '',
    fieldErrors: {},
  });

  const form = useForm<OperationsFormData>({
    resolver: zodResolver(operationsFormSchema),
    defaultValues: {
      maintenanceMode: Boolean(settings.maintenanceMode ?? false),
    },
  });

  const handleSubmit = async (data: OperationsFormData) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token non disponible');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add form data
      formData.append('maintenanceMode', data.maintenanceMode.toString());

      await formAction(formData);
    });
  };

  // Handle state changes with useEffect
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
  }, [state.success, state.message]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  const watchedValues = form.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Mode de maintenance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Contrôle la disponibilité du site et affiche les messages de maintenance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maintenanceMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Activer le mode de maintenance
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Lorsqu'il est activé, les visiteurs verront un message de maintenance au lieu du site normal
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending || csrfLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Maintenance Mode Status */}
            {watchedValues.maintenanceMode && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Mode de maintenance actif:</strong> Votre site est actuellement en mode de maintenance. 
                  Les visiteurs verront un message de maintenance au lieu du contenu normal du site.
                </AlertDescription>
              </Alert>
            )}

            {/* Success/Error Messages */}
            {state.success && (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            {state.error && (
              <Alert className="border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {state.error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isPending || csrfLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres de maintenance
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Status Information */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium text-foreground">Statut actuel</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mode de maintenance</span>
              <Badge variant={watchedValues.maintenanceMode ? "destructive" : "secondary"}>
                {watchedValues.maintenanceMode ? "Actif" : "Inactif"}
              </Badge>
            </div>
            
            {watchedValues.maintenanceMode && (
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <strong>Ce qui se passe lorsque le mode de maintenance est actif:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Les visiteurs voient un message "Site en maintenance"</li>
                  <li>Le contenu du site normal est masqué</li>
                  <li>Le panneau d'administration reste accessible</li>
                  <li>Parfait pour les mises à jour, la maintenance, ou les fermetures temporaires</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 