'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateProduct } from '@/features/products/services/updateProduct';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';
import { UpdateProductState } from '@/types/api';

export async function updateProductAction(prevState: UpdateProductState, formData: FormData): Promise<UpdateProductState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const brand = formData.get('brand') as string;
    const reference = formData.get('reference') as string;
    const categoryIds = formData.getAll('categoryIds') as string[];
    const keepImageIds = formData.getAll('keepImageIds') as string[];
    const newImages: File[] = [];
    formData.forEach((value, key) => {
      if (key === 'images' && value instanceof File) {
        newImages.push(value);
      }
    });

    if (!id) {
      return {
        error: 'Product ID is required',
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: []
        }
      };
    }

    const result = await updateProduct(id, {
      name,
      description,
      price: parseFloat(price),
      brand: brand || undefined,
      reference: reference || undefined,
      categoryIds,
      keepImageIds,
      newImages,
    });

    if (result.success) {
      // Revalidate relevant pages so details reflect latest data
      try {
        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath(`/admin/products/${id}/edit`);
        revalidatePath('/products');
        revalidatePath(`/products/${id}`);
      } catch (e) {
        console.warn('Revalidation failed (non-fatal):', e);
      }
      return {
        error: '',
        fieldErrors: {},
        values: {
          name,
          description,
          price,
          brand,
          reference,
          categoryIds,
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to update product',
        fieldErrors: result.fieldErrors,
        values: {
          name,
          description,
          price,
          brand,
          reference,
          categoryIds,
        },
      };
    }
  } catch (error) {
    console.error('Update product action error:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: []
        }
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: []
        }
      };
    }
    return {
      error: 'An unexpected error occurred while updating the product',
      fieldErrors: {},
      values: {
        name: '',
        description: '',
        price: '',
        brand: '',
        reference: '',
        categoryIds: [],
      },
    };
  }
} 