'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { deleteCategoryAction } from '@/features/categories/actions/deleteCategory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
}

export default function DeleteCategoryModal({
  open,
  onClose,
  categoryId,
  categoryName,
  onSuccess,
}: DeleteCategoryModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(deleteCategoryAction, {
    success: false,
    error: '',
    fieldErrors: {},
  });

  useEffect(() => {
    
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Catégorie supprimée avec succès!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onSuccess?.();
        onClose();
      } else if (state.error) {
        toast.error(state.error || 'Échec de la suppression de la catégorie', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess, onClose]);

  // Debug: Log when action state changes
  useEffect(() => {
  }, [state]);

  const handleDelete = () => {
    if (!csrfToken) {
      toast.error('Token de sécurité non disponible. Veuillez rafraîchir la page.');
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('csrf_token', csrfToken);

    startTransition(() => {
      formAction(formData);
    });
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Supprimer la catégorie
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Cette action ne peut pas être annulée
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800">
                    Êtes-vous sûr de vouloir supprimer "{categoryName}"?
                  </p>
                  <p className="text-sm text-orange-700">
                    Cette action supprimera la catégorie de votre système. 
                      Si la catégorie est utilisée par un produit, la suppression sera prévenue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {state.error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{state.error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="pt-4">
          <div className="flex justify-end gap-2 w-full">
            <Button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer la catégorie
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
