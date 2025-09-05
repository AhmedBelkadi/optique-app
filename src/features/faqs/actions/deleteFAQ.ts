'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { validateCSRFToken } from '@/lib/csrf';
import { getAllFAQs } from '../services/getAllFAQs';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { requirePermission } from '@/lib/auth/authorization';

export interface DeleteFAQState {
  success: boolean;
  error: string;
  data?: any[];
}

export async function deleteFAQAction(prevState: DeleteFAQState, 
  formData: FormData
): Promise<DeleteFAQState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('faqs', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract the ID
    const id = formData.get('id') as string;

    // Validate the ID
    if (!id) {
      return {
        success: false,
        error: 'FAQ ID is required',
      };
    }

    // Delete the FAQ
    await prisma.fAQ.delete({
      where: { id },
    });

    // Get remaining FAQs to update their order
    const remainingFAQs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });

    // Update order for remaining FAQs
    for (let i = 0; i < remainingFAQs.length; i++) {
      await prisma.fAQ.update({
        where: { id: remainingFAQs[i].id },
        data: { order: i + 1 },
      });
    }

    // Revalidate the FAQ page and admin page
    revalidatePath('/faq');
    revalidatePath('/admin/content/faq');

    // Get updated list of FAQs
    const updatedFAQsResult = await getAllFAQs();
    const updatedFAQs = updatedFAQsResult.success ? (updatedFAQsResult as any).data || [] : [];

    return {
      success: true,
      error: '',
      data: updatedFAQs,
    };
  } catch (error) {
    console.error('Error in deleteFAQAction:', error);
    
    if (error instanceof Error) {
      // Handle CSRF errors
      if (error.name === 'CSRFError') {
        return {
          success: false,
          error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        };
      }

      // Handle permission/authorization errors
      if (error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect error, likely due to permission issues
        return {
          success: false,
          error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: false,
      error: 'Failed to delete FAQ',
    };
  }
}