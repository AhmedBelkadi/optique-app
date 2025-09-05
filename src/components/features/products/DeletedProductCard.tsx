'use client';

import { useEffect, useRef, startTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { restoreProductAction } from '@/features/products/actions/restoreProduct';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { Product } from '@/features/products/schema/productSchema';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Badge } from '@/components/ui/badge';


interface DeletedProductCardProps {
  product: Product;
  onSuccess?: () => void;
}

export default function DeletedProductCard({ product, onSuccess }: DeletedProductCardProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();

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
    <div className="bg-background rounded-lg shadow-sm p-6 border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
          {product.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <span>Price: {product.price.toFixed(2)} MAD</span>
            {product.brand && <span>Brand: {product.brand}</span>}
            <span>Deleted: {formatDateShort(product.deletedAt!)}</span>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.categories.map((category) => (
                <Badge
                  key={category.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={handleRestore}
            disabled={isPending}
            className="px-3 py-1 bg-emerald-600 text-primary-foreground text-sm rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isPending ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      </div>


    </div>
  );
} 