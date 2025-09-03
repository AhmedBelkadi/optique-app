'use client';

import { useState } from 'react';
import DeletedProductCard from './DeletedProductCard';
import { Product } from '@/features/products/schema/productSchema';

interface DeletedProductsContainerProps {
  initialDeletedProducts: Product[];
}

export default function DeletedProductsContainer({ initialDeletedProducts }: DeletedProductsContainerProps) {
  const [deletedProducts, setDeletedProducts] = useState<Product[]>(initialDeletedProducts);

  const handleRestore = (productId: string) => {
    setDeletedProducts(prev => prev.filter(product => product.id !== productId));
  };

  if (deletedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/60 text-6xl mb-4">✅</div>
        <h3 className="text-lg font-medium text-foreground mb-2">All products restored!</h3>
        <p className="text-muted-foreground">No more deleted products to restore.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deletedProducts.map((product) => (
        <DeletedProductCard
          key={product.id}
          product={product}
          onSuccess={() => handleRestore(product.id)}
        />
      ))}
    </div>
  );
} 