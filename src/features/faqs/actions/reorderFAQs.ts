'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { validateCSRFToken } from '@/lib/csrf';
import { getAllFAQs } from '../services/getAllFAQs';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { requirePermission } from '@/lib/auth/authorization';

export interface ReorderFAQsState {
  success: boolean;
  error: string;
  data?: any[];
}

export async function reorderFAQsAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('faqs', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract the ordered IDs from form data
    const orderedIds: string[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith('faqs[') && key.endsWith('][id]')) {
        orderedIds.push(value as string);
      }
    });

    // Validate the array
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return {
        success: false,
        error: 'Valid FAQ IDs array is required',
      };
    }

    // Update the order for each FAQ
    for (let i = 0; i < orderedIds.length; i++) {
      await prisma.fAQ.update({
        where: { id: orderedIds[i] },
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
    console.error('Error in reorderFAQsAction:', error);
    
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
      error: 'Failed to reorder FAQs',
    };
  }
}