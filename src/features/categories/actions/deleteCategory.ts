'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteCategory } from '@/features/categories/services/deleteCategory';
import { logError } from '@/lib/errorHandling';
import { CategoryActionState } from '@/types/api';
import { revalidateTag } from 'next/cache';

export async function deleteCategoryAction(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
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
      };
    } else {
      return {
        error: result.error || 'Failed to delete category',
        success: false,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        success: false,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        error: 'Security validation failed. Please refresh the page and try again.',
        success: false,
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
    };
  }
} 