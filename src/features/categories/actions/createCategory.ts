'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createCategory } from '@/features/categories/services/createCategory';
import { categorySchema } from '@/features/categories/schema/categorySchema';
import { validateAndSanitizeCategory } from '@/lib/shared/utils/sanitize';
import { saveImage, validateImage, deleteImage } from '@/lib/shared/utils/imageUploadUtils';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { CategoryActionState } from '@/types/api';
import { getCurrentUser } from '@/features/auth/services/session';
import { requirePermission } from '@/lib/auth/authorization';
import { CreateCategoryState } from '@/types/api';

export async function createCategoryAction(prevState: CreateCategoryState, formData: FormData): Promise<CreateCategoryState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('categories', 'create');

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
        success: false,
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    // Create category first
    const result = await createCategory(validation.data);
    
    if (result.success && result.data) {
      let finalCategoryData = result.data;

      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        try {
          // Validate image first
          const validation = validateImage(imageFile);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          // Upload image and update category in transaction
          await prisma.$transaction(async (tx) => {
            const imageResult = await saveImage(imageFile, 'categories', result.data.id);
            
            // Update category with image path
            const updatedCategory = await tx.category.update({
              where: { id: result.data.id },
              data: { image: imageResult.path },
            });

            finalCategoryData = updatedCategory;
          });
          
        } catch (error) {
          logError(error as Error, { 
            action: 'createCategory', 
            categoryId: result.data.id,
            step: 'imageUpload' 
          });
          
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload image',
            fieldErrors: {},
            values: rawData,
          };
        }
      }

      // Invalidate cache to refresh the UI
      revalidateTag('categories');

      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
        },
        data: finalCategoryData, // ← Now includes image path if upload succeeded
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create category',
        fieldErrors: {},
        values: rawData,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
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
        success: false,
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
        },
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
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
      success: false,
      error: 'An unexpected error occurred while creating the category. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      },
    };
  }
}