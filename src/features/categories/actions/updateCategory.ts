'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateCategory } from '@/features/categories/services/updateCategory';
import { categorySchema } from '@/features/categories/schema/categorySchema';
import { validateAndSanitizeCategory } from '@/lib/shared/utils/sanitize';
import { saveImage, validateImage, deleteImage } from '@/lib/shared/utils/imageUploadUtils';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';
import { UpdateCategoryState } from '@/types/api';





export async function updateCategoryAction(prevState: UpdateCategoryState, formData: FormData): Promise<UpdateCategoryState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('categories', 'update');

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
        success: false,
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
          // Validate image first
          const validation = validateImage(imageFile);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          // Get existing category image before updating
          const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { image: true }
          });

          // Upload image and update category in transaction
          const updatedCategory = await prisma.$transaction(async (tx) => {
            const imageResult = await saveImage(imageFile, 'categories', categoryId);
            
            // Update category with new image path
            const updated = await tx.category.update({
              where: { id: categoryId },
              data: { image: imageResult.path },
            });

            return updated;
          });

          // Clean up old image after successful update
          if (existingCategory?.image) {
            await deleteImage(existingCategory.image);
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
            data: updatedCategory,
          };
        } catch (error) {
          logError(error as Error, { 
            action: 'updateCategory', 
            categoryId,
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
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update category',
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
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
        },
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
      success: false,
      error: 'An unexpected error occurred while updating the category. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      },
    };
  }
} 