'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteBanner } from '@/features/banners/services/deleteBanner';
import { logError } from '@/lib/errorHandling';
import { requirePermission, requireAdmin } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function deleteBannerAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK

      await requirePermission('banners', 'delete');
    

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('bannerId') as string;

    const result = await deleteBanner(id);

    if (result.success) {
      revalidatePath('/admin/banners');
      revalidatePath('/', 'layout');
      return {
        success: true,
        message: 'Banner deleted successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to delete banner',
      };
    }
  } catch (error) {
    console.error('Error in deleteBannerAction:', error);
    
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