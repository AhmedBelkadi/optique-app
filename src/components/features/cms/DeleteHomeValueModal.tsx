'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { HomeValues } from '@/features/home/schema/homeValuesSchema';
import { deleteHomeValueAction, DeleteHomeValueState } from '@/features/home/actions/deleteHomeValue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeleteHomeValueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: HomeValues | null;
  onSuccess?: (updatedValues: HomeValues[]) => void;
}

export default function DeleteHomeValueModal({
  open,
  onOpenChange,
  value,
  onSuccess,
}: DeleteHomeValueModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();

  const [state, formAction, isPending] = useActionState<DeleteHomeValueState, FormData>(
    deleteHomeValueAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Valeur supprimée avec succès !');
        if (state.data) {
          onSuccess?.(state.data);
        }
        onOpenChange(false);
      } else if (state.error) {
        toast.error(state.error || 'Échec de la suppression de la valeur');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, onSuccess, onOpenChange]);

  const handleSubmit = (formData: FormData) => {
    if (!value) return;
    
    formData.append('id', value.id);
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    
    formAction(formData);
  };

  if (!value) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span>Supprimer la Valeur</span>
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette valeur ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Value Preview */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-destructive">{value.title}</h4>
                  <p className="text-sm text-destructive/80 line-clamp-2">
                    {value.description}
                  </p>
                  {value.highlight && (
                    <div className="mt-2">
                      <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                        {value.highlight}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800">
                    Attention : Suppression définitive
                  </p>
                  <p className="text-sm text-orange-700">
                    Cette valeur sera supprimée de votre page d'accueil et ne pourra pas être récupérée.
                    Assurez-vous que cette action est bien nécessaire.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {state.error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center text-destructive">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{state.error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <form action={handleSubmit}>
          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                variant="default"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
