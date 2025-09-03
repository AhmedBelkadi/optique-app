'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteProduct } from '@/features/products/services/deleteProduct';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { DeleteProductState } from '@/types/api';

export async function deleteProductAction(prevState: DeleteProductState, formData: FormData): Promise<DeleteProductState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'delete');

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

    const result = await deleteProduct(id);

    if (result.success) {
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to delete product',
      };
    }
  } catch (error) {
    console.error('Delete product action error:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the product',
    };
  }
} 