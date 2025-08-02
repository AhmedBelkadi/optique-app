'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteProductAction } from '@/features/products/actions/softDeleteProduct';
import { Product } from '@/features/products/schema/productSchema';

interface DeleteProductModalProps {
  product: Product;
  onSuccess?: () => void;
}

export default function DeleteProductModal({ product, onSuccess }: DeleteProductModalProps) {
  const [open, setOpen] = useState(false);
  const previousIsPending = useRef(false);
  
  const [state, formAction, isPending] = useActionState(deleteProductAction, {
    error: '',
    success: false,
  });

  const handleSubmit = (formData: FormData) => {
    formData.append('productId', product.id);
    formAction(formData);
  };

  // Handle successful deletion
  useEffect(() => {
    if (previousIsPending.current && !isPending && state.success) {
      setOpen(false);
      toast.success('Product moved to trash successfully!');
      onSuccess?.();
    } else if (previousIsPending.current && !isPending && state.error) {
      toast.error(state.error || 'Failed to delete product');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete "{product.name}"?
            </h3>
            <p className="text-sm text-gray-500">
              This action will move the product to the trash. You can restore it later if needed.
            </p>
          </div>

          {state.error && (
            <div className="text-red-600 text-sm text-center">{state.error}</div>
          )}

          <form action={handleSubmit} className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete Product'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 