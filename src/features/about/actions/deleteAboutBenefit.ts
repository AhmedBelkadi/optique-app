'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function deleteAboutBenefitAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('about', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('aboutBenefitId') as string;

    // Validate input
    if (!id) {
      return {
        success: false,
        error: 'Benefit ID is required',
      };
    }

    // Delete the benefit
    await prisma.aboutBenefit.delete({
      where: { id },
    });

    // Get remaining benefits
    const remainingBenefits = await prisma.aboutBenefit.findMany({
      orderBy: { order: 'asc' },
    });

    // Revalidate the about page
    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return {
      success: true,
      message: 'About benefit deleted successfully',
      data: remainingBenefits,
    };
  } catch (error) {
    console.error('Error in deleteAboutBenefitAction:', error);
    
    if (error instanceof Error) {
      // Handle CSRF errors
      if (error.name === 'CSRFError') {
        return {
          success: false,
          error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
          fieldErrors: {}
        };
      }

      // Handle permission/authorization errors
      if (error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect error, likely due to permission issues
        return {
          success: false,
          error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
          fieldErrors: {}
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}