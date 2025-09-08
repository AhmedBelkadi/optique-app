'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { softDeleteProduct } from '@/features/products/services/softDeleteProduct';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function softDeleteProductAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const productId = formData.get('productId') as string;
    
    const result = await softDeleteProduct(productId);
    
    if (result.success) {
      try { revalidatePath('/products'); } catch {}
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to delete product',
        success: false,
      };
    }
  } catch (error) {
    console.error('Error deleting product:', error);
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
      error: 'An unexpected error occurred',
      success: false,
    };
  }
} 