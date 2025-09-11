'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteProductAction } from '@/features/products/actions/deleteProduct';
import { Product } from '@/features/products/schema/productSchema';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteProductModalProps {
  product: Product;
  onSuccess?: () => void;
  onClose: () => void;
}

export default function DeleteProductModal({ product, onSuccess, onClose }: DeleteProductModalProps) {
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const { csrfToken } = useCSRF();

  const [state, formAction] = useActionState(deleteProductAction, {
    success: false,
    error: '',
  });

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Produit supprimé avec succès!');
        onSuccess?.();
        onClose();
      } else if (state.error) {
        toast.error(state.error || 'Échec de la suppression du produit');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess, onClose]);

  const handleDelete = () => {
    if (!csrfToken) {
      toast.error('Token de sécurité non disponible. Veuillez rafraîchir la page.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('csrf_token', csrfToken);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer le produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer "{product.name}"? Cette action ne peut pas être annulée.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={onClose}
              disabled={isPending}
              className="bg-gray-300 text-black"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-primary-foreground"
            >
              {isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
