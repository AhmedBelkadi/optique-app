'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { updateProductAction } from '@/features/products/actions/updateProduct';
import ImageUpload from '@/components/features/products/ImageUpload';
import CategoryMultiSelect from '@/components/features/categories/CategoryMultiSelect';

interface ImageFile {
  id: string;
  file?: File; // Only for new images
  preview: string;
  alt: string;
  existing?: boolean;
  serverId?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  reference?: string | null;
  categories: Category[];
  images: {
    id: string;
    path: string;
    alt?: string | null;
  }[];
}

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  csrfToken?: string;
}

export default function EditProductForm({ product, categories, csrfToken }: EditProductFormProps) {
  const router = useRouter();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product.categories.map(cat => cat.id)
  );
  const [images, setImages] = useState<ImageFile[]>(
    product.images.map(img => ({
      id: img.id,
      preview: img.path,
      alt: img.alt || '',
      existing: true,
      serverId: img.id,
    }))
  );
  const previousIsPending = useRef(false);

  const [state, formAction, isPending] = useActionState(updateProductAction, {
    success: false,
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
    // Add CSRF token
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    formData.append('productId', product.id);
    
    // Add category IDs to form data
    selectedCategoryIds.forEach(categoryId => {
      formData.append('categoryIds', categoryId);
    });

    // Add images to form data
    images.forEach(image => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    formAction(formData);
  };

  // Handle successful update
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        // Success - show toast and redirect
        toast.success('Produit mis à jour avec succès !');
        router.push(`/products/${product.id}`);
      } else if (state.error) {
        // Error occurred
        toast.error(state.error || 'Échec de la mise à jour du produit');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, router, product.id]);

  if (!csrfToken) {
    return <div>Chargement du jeton de sécurité...</div>;
  }

  return (
    <div className="bg-background rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Modifier le Produit</h1>
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Retour
        </button>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* CSRF Token */}
        <input type="hidden" name="csrf_token" value={csrfToken} />
        
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Nom du Produit *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={state.values?.name || product.name}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Entrez le nom du produit"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={state.values?.description || product.description || ''}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Entrez la description du produit"
          />
          {state.fieldErrors?.description && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.description}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-foreground">
            Prix *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              required
              defaultValue={state.values?.price || product.price.toString()}
              className="pl-7 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="0.00"
            />
          </div>
          {state.fieldErrors?.price && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.price}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-foreground">
            Marque
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            defaultValue={state.values?.brand || product.brand || ''}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Entrez le nom de la marque"
          />
          {state.fieldErrors?.brand && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.brand}</p>
          )}
        </div>

        {/* Reference */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-foreground">
            Reference
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            defaultValue={state.values?.reference || product.reference || ''}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter product reference"
          />
          {state.fieldErrors?.reference && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.reference}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categories
          </label>
          <CategoryMultiSelect
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onSelectionChange={setSelectedCategoryIds}
          />
          {state.fieldErrors?.categoryIds && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.categoryIds}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Product Images
          </label>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="text-destructive text-sm text-center bg-destructive/5 p-3 rounded-md">
            {state.error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isPending ? 'Mise à jour...' : 'Mettre à Jour le Produit'}
          </button>
        </div>
      </form>
    </div>
  );
} 