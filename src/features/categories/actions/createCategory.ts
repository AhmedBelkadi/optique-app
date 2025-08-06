'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createCategory } from '@/features/categories/services/createCategory';
import { categorySchema } from '@/features/categories/schema/categorySchema';
import { validateAndSanitizeCategory } from '@/lib/shared/utils/sanitize';
import { saveCategoryImage } from '@/lib/shared/utils/serverCategoryImageUpload';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { CategoryActionState } from '@/types/api';

export async function createCategoryAction(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    // Sanitize input
    const sanitizedData = validateAndSanitizeCategory(rawData);
    
    // Validate sanitized input
    const validation = categorySchema.create.safeParse(sanitizedData);
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    // Create category first
    const result = await createCategory(validation.data);
    
    if (result.success && result.data) {
      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        try {
          const imageResult = await saveCategoryImage(imageFile, result.data.id);
          
          // Update category with image path
          await prisma.category.update({
            where: { id: result.data.id },
            data: { image: imageResult.path },
          });
        } catch (error) {
          logError(error as Error, { 
            action: 'createCategory', 
            categoryId: result.data.id,
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
        error: result.error || 'Failed to create category',
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
      action: 'createCategory',
      formData: {
        name: formData.get('name'),
        description: formData.get('description'),
      }
    });
    
    return {
      error: 'An unexpected error occurred while creating the category. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      },
    };
  }
} 