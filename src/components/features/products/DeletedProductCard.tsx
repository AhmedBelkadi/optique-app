'use client';

import React from 'react';
import { useActionState, startTransition } from 'react';
import { toast } from 'react-hot-toast';
import { restoreProductAction } from '@/features/products/actions/restoreProduct';
import { Product } from '@/features/products/schema/productSchema';

interface DeletedProductCardProps {
  product: Product;
  onRestore: (productId: string) => void;
}

export default function DeletedProductCard({ product, onRestore }: DeletedProductCardProps) {
  const [state, formAction, isPending] = useActionState(restoreProductAction, {
    success: false,
    error: '',
  });

  const handleRestore = () => {
    if (!confirm('Are you sure you want to restore this product?')) {
      return;
    }

    const formData = new FormData();
    formData.append('id', product.id);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle success/error states
  React.useEffect(() => {
    if (state.success) {
      toast.success('Product restored successfully!');
      onRestore(product.id);
    } else if (state.error) {
      toast.error(state.error || 'Failed to restore product');
    }
  }, [state.success, state.error, onRestore, product.id]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* Deleted indicator */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Deleted
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <div className="flex flex-wrap gap-1">
            {product.categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        <div>Created: {new Date(product.createdAt).toLocaleDateString()}</div>
        <div>Deleted: {product.deletedAt ? new Date(product.deletedAt).toLocaleDateString() : 'Unknown'}</div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRestore}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Restoring...' : 'Restore Product'}
        </button>
      </div>
    </div>
  );
} 