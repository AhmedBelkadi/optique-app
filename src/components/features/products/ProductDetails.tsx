'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useActionState, startTransition } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { deleteProductAction } from '@/features/products/actions/deleteProduct';
import { Product } from '@/features/products/schema/productSchema';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(deleteProductAction, {
    success: false,
    error: '',
  });

  const handleDelete = () => {
    if (!confirm('Are you sure you want to move this product to trash? It can be restored later.')) {
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
      toast.success('Product moved to trash successfully!');
      router.push('/products');
    } else if (state.error) {
      toast.error(state.error || 'Failed to move product to trash');
    }
  }, [state.success, state.error, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Moving to Trash...' : 'Move to Trash'}
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Info */}
              <div className="space-y-6">
                {/* Product Images */}
                {product.images.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={image.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                          <Image
                            src={image.path}
                            alt={image.alt || `${product.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                    {product.images.length > 4 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{product.images.length - 4} more images
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Price</h2>
                  <div className="text-3xl font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Product ID:</span>
                      <p className="text-sm text-gray-900">{product.id}</p>
                    </div>
                    
                    {product.brand && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Brand:</span>
                        <p className="text-sm text-gray-900">{product.brand}</p>
                      </div>
                    )}
                    
                    {product.reference && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Reference:</span>
                        <p className="text-sm text-gray-900">{product.reference}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 