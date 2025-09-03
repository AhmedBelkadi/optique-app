'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateBanner } from '@/features/banners/services/updateBanner';
import { requirePermission } from '@/lib/auth/authorization';
import { updateBannerSchema } from '../schema/bannerSchema';
import { revalidatePath } from 'next/cache';

export async function updateBannerAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('banners', 'update');

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
    const id = formData.get('id') as string;
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
      id,
      text,
      startDate,
      endDate,
      isActive,
    };

    // Validate data
    const validation = updateBannerSchema.safeParse(rawData);
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

    // Update banner
    const result = await updateBanner(id, validation.data);
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update banner',
        values: rawData,
      };
    }

    // Revalidate pages
    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Banner updated successfully',
      data: result.data,
    };

  } catch (error) {
    console.error('Error in updateBannerAction:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating the banner',
    };
  }
}
