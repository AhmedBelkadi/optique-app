'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteProductAction } from '@/features/products/actions/deleteProduct';
import { Product } from '@/features/products/schema/productSchema';
import { useCSRF } from '@/components/common/CSRFProvider';

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
        toast.success('Product deleted successfully!');
        onSuccess?.();
        onClose();
      } else if (state.error) {
        toast.error(state.error || 'Failed to delete product');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess, onClose]);

  const handleDelete = () => {
    if (!csrfToken) {
      toast.error('Security token not available. Please refresh the page.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Delete Product</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "{product.name}"? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 bg-destructive text-primary-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
