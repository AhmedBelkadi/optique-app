'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/features/products/schema/productSchema';
import DeleteProductModal from '@/components/features/products/DeleteProductModal';

interface ProductGridProps {
  products: Product[];
  onDelete?: (productId: string) => void;
}

export default function ProductGrid({ products, onDelete }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          {/* Product Image */}
          <div className="relative h-48 bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].path}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Product Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              {product.brand && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Brand:</span> {product.brand}
                </div>
              )}
              
              {product.reference && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">SKU:</span> {product.reference}
                </div>
              )}
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product Stats */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Created {new Date(product.createdAt).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View
                </Link>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Edit
                </Link>
              </div>
              <DeleteProductModal product={product} onSuccess={() => onDelete?.(product.id)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 