'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function reorderAboutBenefitsAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('about', 'update');

    // Safety check for formData
    if (!formData || typeof formData.get !== 'function') {
      return {
        success: false,
        error: 'Invalid form data provided.',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);


    const orderedIds = formData.getAll('orderedIds') as string[];

    // Validate input
    if (!orderedIds || orderedIds.length === 0) {
      return {
        success: false,
        error: 'Ordered IDs are required',
      };
    }

    // Update the order of each benefit
    const updatePromises = orderedIds.map((id, index) =>
      prisma.aboutBenefit.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updatePromises);

    // Get the updated benefits in the new order
    const updatedBenefits = await prisma.aboutBenefit.findMany({
      orderBy: { order: 'asc' },
    });

    // Revalidate the about page
    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return {
      success: true,
      message: 'About benefits reordered successfully',
      data: updatedBenefits,
    };
  } catch (error) {
    console.error('Error in reorderAboutBenefitsAction:', error);
    
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