'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { restoreProduct } from '@/features/products/services/restoreProduct';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { RestoreProductState } from '@/types/api';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function restoreProductAction(prevState: RestoreProductState, formData: FormData): Promise<RestoreProductState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('productId') as string;

    if (!id) {
      return {
        success: false,
        error: 'Product ID is required',
      };
    }

    const result = await restoreProduct(id);

    if (result.success) {
      // Revalidate relevant paths and tags
      revalidatePath('/admin/products');
      revalidatePath('/admin/products/trash');
      revalidateTag('products');
      revalidateTag('deleted-products');
      
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to restore product',
      };
    }
  } catch (error) {
    console.error('Restore product action error:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred while restoring the product',
    };
  }
} 