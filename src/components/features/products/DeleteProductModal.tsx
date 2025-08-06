'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteProductAction } from '@/features/products/actions/deleteProduct';
import { Product } from '@/features/products/schema/productSchema';

interface DeleteProductModalProps {
  product: Product;
  onSuccess?: () => void;
  onClose: () => void;
}

export default function DeleteProductModal({ product, onSuccess, onClose }: DeleteProductModalProps) {
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();

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
    const formData = new FormData();
    formData.append('productId', product.id);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Product</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{product.name}"? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
