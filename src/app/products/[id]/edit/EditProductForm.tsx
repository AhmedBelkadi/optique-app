'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { updateProductAction } from '@/features/products/actions/updateProduct';
import ImageUpload from '@/components/features/products/ImageUpload';
import CategoryMultiSelect from '@/components/features/categories/CategoryMultiSelect';
import { Product } from '@/features/products/schema/productSchema';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface ImageFile {
  id: string;
  file?: File; // Only for new images
  preview: string;
  alt: string;
  existing?: boolean;
  serverId?: string;
}

interface EditProductFormProps {
  product: Product;
  categories: Category[];
}

export default function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product.categories.map(cat => cat.id)
  );
  const [images, setImages] = useState<ImageFile[]>([]);
  const previousIsPending = useRef(false);

  // Initialize images state with existing product images on mount
  useEffect(() => {
    const initialImages: ImageFile[] = product.images.map(img => ({
      id: img.id, // use DB id as unique id
      preview: img.path, // server URL
      alt: img.alt || '',
      existing: true,
      serverId: img.id,
    }));
    setImages(initialImages);
  }, [product.images]);

  const [state, formAction, isPending] = useActionState(updateProductAction, {
    error: '',
    fieldErrors: {},
    values: {
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      brand: product.brand || '',
      reference: product.reference || '',
      categoryIds: product.categories.map(cat => cat.id),
    },
  });

  const handleSubmit = (formData: FormData) => {
    // Always include product ID
    formData.set('id', product.id);
    // Add category IDs to form data
    selectedCategoryIds.forEach(categoryId => {
      formData.append('categoryIds', categoryId);
    });
    // Add new images to form data
    images.forEach(image => {
      if (!image.existing && image.file) {
        formData.append('images', image.file);
      }
    });
    // Add IDs of existing images to keep
    const keepImageIds = images.filter(img => img.existing).map(img => img.serverId);
    keepImageIds.forEach(id => {
      formData.append('keepImageIds', id!);
    });
    formAction(formData);
  };

  // Handle success/error states
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error) {
      // Success - redirect to product details page
      toast.success('Product updated successfully!');
      router.push(`/products/${product.id}`);
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Failed to update product');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, router, product.id]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* Hidden Product ID */}
        <input type="hidden" name="id" value={product.id} />
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              required
              defaultValue={state.values?.name || product.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product name"
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              autoComplete="off"
              defaultValue={state.values?.brand || product.brand || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter brand name"
            />
            {state.fieldErrors?.brand && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.brand}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              required
              defaultValue={state.values?.price || product.price.toString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
            {state.fieldErrors?.price && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
              Reference (SKU)
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              autoComplete="off"
              defaultValue={state.values?.reference || product.reference || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product reference"
            />
            {state.fieldErrors?.reference && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.reference}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={state.values?.description || product.description || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product description"
          />
          {state.fieldErrors?.description && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.description}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <CategoryMultiSelect
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onSelectionChange={setSelectedCategoryIds}
          />
          {state.fieldErrors?.categoryIds && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.categoryIds}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
          {state.fieldErrors?.images && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.images}</p>
          )}
        </div>

        {state.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 