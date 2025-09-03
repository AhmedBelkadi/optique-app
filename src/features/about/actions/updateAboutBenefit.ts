'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';

import { requirePermission } from '@/lib/auth/authorization';
import { getCurrentUser } from '@/features/auth/services/session';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { aboutBenefitFormSchema } from '@/features/about/schema/aboutBenefitSchema';

export async function updateAboutBenefitAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('about', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('aboutBenefitId') as string;

    // Extract form data for validation
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      highlight: formData.get('highlight') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      bgColor: formData.get('bgColor') as string,
    };

    // Validate form data
    const validatedData = aboutBenefitFormSchema.parse(rawData);

    // Update the benefit
    await prisma.aboutBenefit.update({
      where: { id },
      data: validatedData,
    });

    // Get all benefits to return updated list
    const allBenefits = await prisma.aboutBenefit.findMany({
      orderBy: { order: 'asc' },
    });

    // Revalidate the about page
    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return {
      success: true,
      message: 'About benefit updated successfully',
      data: allBenefits,
    };
  } catch (error) {
    console.error('Error in updateAboutBenefitAction:', error);
    
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