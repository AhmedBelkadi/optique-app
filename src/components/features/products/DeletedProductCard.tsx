'use client';

import { useEffect, useRef, startTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { restoreProductAction } from '@/features/products/actions/restoreProduct';
import { Product } from '@/features/products/schema/productSchema';

interface DeletedProductCardProps {
  product: Product;
  onSuccess?: () => void;
}

export default function DeletedProductCard({ product, onSuccess }: DeletedProductCardProps) {
  const previousIsPending = useRef(false);

  const [state, formAction, isPending] = useActionState(restoreProductAction, {
    success: false,
    error: '',
  });

  // Handle restore success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Product restored successfully!');
        onSuccess?.();
      } else if (state.error) {
        toast.error(state.error || 'Failed to restore product');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess]);

  const handleRestore = () => {
    const formData = new FormData();
    formData.append('productId', product.id);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span>Price: ${product.price.toFixed(2)}</span>
            {product.brand && <span>Brand: {product.brand}</span>}
            <span>Deleted: {new Date(product.deletedAt!).toLocaleDateString()}</span>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={handleRestore}
            disabled={isPending}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isPending ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      </div>

      {product.images && product.images.length > 0 && (
        <div className="mt-4">
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.slice(0, 3).map((image) => (
              <div key={image.id} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={image.path}
                  alt={image.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {product.images.length > 3 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                +{product.images.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 