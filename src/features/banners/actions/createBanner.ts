'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createBanner } from '@/features/banners/services/createBanner';
import { requirePermission, requireAdmin } from '@/lib/auth/authorization';
import { createBannerSchema } from '../schema/bannerSchema';
import { revalidatePath } from 'next/cache';

export async function createBannerAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
      await requirePermission('banners', 'create');


        // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    try {
      await apiRateLimit(identifier);
    } catch (error) {
      console.error('Rate limiting failed:', error);
      return {
        success: false,
        error: 'Rate limit exceeded',
      };
    }
    
    // Validate CSRF token
    try {
      await validateCSRFToken(formData);
    } catch (error) {
      console.error('CSRF validation failed:', error);
      return {
        success: false,
        error: 'CSRF validation failed',
      };
    }
    
    // Parse form data
    const text = formData.get('text') as string;
    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const isActive = formData.get('isActive') === 'true';
    
    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        success: false,
        error: 'Invalid date format provided',
        fieldErrors: {
          startDate: isNaN(startDate.getTime()) ? 'Invalid start date' : undefined,
          endDate: isNaN(endDate.getTime()) ? 'Invalid end date' : undefined,
        },
      };
    }

    const rawData = {
      text,
      startDate,
      endDate,
      isActive,
    };

    // Validate data
    const validation = createBannerSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });

      return {
        success: false,
        error: 'Validation failed',
        fieldErrors,
        values: rawData,
      };
    }

    // Create banner
    const result = await createBanner(validation.data);
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to create banner',
        values: rawData,
      };
    }

    // Revalidate pages
    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Banner created successfully',
      data: result.data,
    };
  } catch (error) {
    console.error('Error in createBannerAction:', error);
    
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
      error: 'An unexpected error occurred',
    };
  }
}