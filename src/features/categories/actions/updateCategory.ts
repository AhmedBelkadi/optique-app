'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateCategory } from '@/features/categories/services/updateCategory';
import { categorySchema } from '@/features/categories/schema/categorySchema';
import { validateAndSanitizeCategory } from '@/lib/shared/utils/sanitize';
import { saveCategoryImage } from '@/lib/shared/utils/serverCategoryImageUpload';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { CategoryActionState } from '@/types/api';

export async function updateCategoryAction(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const categoryId = formData.get('categoryId') as string;
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    // Sanitize input
    const sanitizedData = validateAndSanitizeCategory(rawData);
    
    // Validate sanitized input
    const validation = categorySchema.update.safeParse(sanitizedData);
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    // Update category
    const result = await updateCategory(categoryId, validation.data);
    
    if (result.success && result.data) {
      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        try {
          const imageResult = await saveCategoryImage(imageFile, categoryId);
          
          // Update category with new image path
          await prisma.category.update({
            where: { id: categoryId },
            data: { image: imageResult.path },
          });
        } catch (error) {
          logError(error as Error, { 
            action: 'updateCategory', 
            categoryId,
            step: 'imageUpload' 
          });
          // Continue even if image upload fails
        }
      }

      // Invalidate cache to refresh the UI
      revalidateTag('categories');

      return {
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to update category',
        fieldErrors: {},
        values: rawData,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
        },
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'updateCategory',
      formData: {
        categoryId: formData.get('categoryId'),
        name: formData.get('name'),
        description: formData.get('description'),
      }
    });
    
    return {
      error: 'An unexpected error occurred while updating the category. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      },
    };
  }
} 