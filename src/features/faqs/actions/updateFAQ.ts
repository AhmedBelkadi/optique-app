'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { faqFormSchema } from '@/features/faqs/schema/faqSchema';
import { validateCSRFToken } from '@/lib/csrf';
import { getAllFAQs } from '../services/getAllFAQs';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { requirePermission } from '@/lib/auth/authorization';

export interface UpdateFAQState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: any;
  data?: any[];
}

export async function updateFAQAction(prevState: UpdateFAQState, 
  formData: FormData
): Promise<UpdateFAQState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('faqs', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract form data
    const id = formData.get('id') as string;
    const data = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
    };

    // Validate the ID
    if (!id) {
      return {
        success: false,
        error: 'FAQ ID is required',
        fieldErrors: {},
        values: {},
      };
    }

    // Validate form data
    const validatedData = faqFormSchema.parse(data);

    // Update the FAQ
    const faq = await prisma.fAQ.update({
      where: { id },
      data: validatedData,
    });

    // Revalidate the FAQ page and admin page
    revalidatePath('/faq');
    revalidatePath('/admin/content/faq');

    // Get updated list of FAQs
    const updatedFAQsResult = await getAllFAQs();
    const updatedFAQs = updatedFAQsResult.success ? (updatedFAQsResult as any).data || [] : [];

    return {
      success: true,
      error: '',
      fieldErrors: {},
      values: {},
      data: updatedFAQs,
    };
  } catch (error) {
    console.error('Error in updateFAQAction:', error);
    
    if (error instanceof Error) {
      // Handle CSRF errors
      if (error.name === 'CSRFError') {
        return {
          success: false,
          error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
          fieldErrors: {},
          values: {}
        };
      }

      // Handle permission/authorization errors
      if (error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect error, likely due to permission issues
        return {
          success: false,
          error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
          fieldErrors: {},
          values: {}
        };
      }
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {}
      };
    }
    
    return {
      success: false,
      error: 'Failed to update FAQ',
      fieldErrors: {},
      values: {},
    };
  }
}