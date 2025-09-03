'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function toggleBannerAction(prevState: any, formData: FormData): Promise<any> {
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
    const bannerId = formData.get('bannerId') as string;
    const isActive = formData.get('isActive') === 'true';

    if (!bannerId) {
      return {
        success: false,
        error: 'Banner ID is required',
      };
    }

    // Get current banner
    const currentBanner = await prisma.banner.findFirst({
      where: { id: bannerId },
    });

    if (!currentBanner) {
      return {
        success: false,
        error: 'Banner not found',
      };
    }

    // Toggle banner status
    const updatedBanner = await prisma.banner.update({
      where: { id: bannerId },
      data: { isActive },
    });

    // Revalidate pages
    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `Banner ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedBanner,
    };

  } catch (error) {
    console.error('Error in toggleBannerAction:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while toggling the banner',
    };
  }
}
