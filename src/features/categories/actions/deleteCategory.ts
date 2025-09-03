'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteCategory } from '@/features/categories/services/deleteCategory';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { CategoryActionState } from '@/types/api';
import { revalidateTag } from 'next/cache';

export async function deleteCategoryAction(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('categories', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const categoryId = formData.get('categoryId') as string;
    
    const result = await deleteCategory(categoryId);
    
    if (result.success) {
      // Invalidate cache to refresh the UI
      revalidateTag('categories');
      
      return {
        error: '',
        success: true,
        fieldErrors: {},
      };
    } else {
      return {
        error: result.error || 'Failed to delete category',
        success: false,
        fieldErrors: {},
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        success: false,
        fieldErrors: {},
      };
    }
    
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

    // Log and handle other errors
    logError(error as Error, { 
      action: 'deleteCategory',
      formData: {
        categoryId: formData.get('categoryId'),
      }
    });
    
    return {
      error: 'An unexpected error occurred while deleting the category. Please try again.',
      success: false,
      fieldErrors: {},
    };
  }
} 