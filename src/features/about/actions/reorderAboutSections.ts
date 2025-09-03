'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function reorderAboutSectionsAction(prevState: any, formData: FormData): Promise<any> {
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



    // Parse form data - extract section IDs and their new order
    const orderedSections: { id: string; order: number }[] = [];
    
    // Get all form entries and parse them
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^sections\[(\d+)\]\[id\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const id = value as string;
        orderedSections.push({ id, order: index + 1 });
      }
    }

    if (orderedSections.length === 0) {
      return {
        success: false,
        error: 'No sections to reorder',
      };
    }

    // Update the order of each section
    const updatePromises = orderedSections.map(({ id, order }) =>
      prisma.aboutSection.update({
        where: { id },
        data: { order },
      })
    );

    await Promise.all(updatePromises);

    // Get the updated sections in the new order
    const updatedSections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' },
    });

    // Revalidate the about page
    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return {
      success: true,
      message: 'About sections reordered successfully',
      data: updatedSections,
    };
  } catch (error) {
    console.error('Error in reorderAboutSectionsAction:', error);
    
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