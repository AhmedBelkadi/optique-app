'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { deleteFAQAction, DeleteFAQState } from '@/features/faqs/actions/deleteFAQ';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Card, CardContent } from '@/components/ui/card';

interface DeleteFAQModalProps {
  faq: {
    id: string;
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedFAQs: any[]) => void;
}

export default function DeleteFAQModal({ faq, isOpen, onClose, onSuccess }: DeleteFAQModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();

  const [state, formAction, isPending] = useActionState<DeleteFAQState, FormData>(
    deleteFAQAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('FAQ supprimée avec succès !');
        if (state.data) {
          onSuccess(state.data);
        }
        onClose();
      } else if (state.error) {
        toast.error(state.error || 'Échec de la suppression de la FAQ');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, onSuccess, onClose]);

  const handleDelete = (formData: FormData) => {
    formData.append('id', faq.id);
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    
    formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Supprimer la FAQ
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* FAQ Preview */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-destructive mb-2">{faq.question}</h4>
                  <p className="text-sm text-destructive/80 line-clamp-3">
                    {faq.answer}
                  </p>
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
                    Cette FAQ sera supprimée de votre page FAQ et ne pourra pas être récupérée.
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

        <form action={handleDelete}>
          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
