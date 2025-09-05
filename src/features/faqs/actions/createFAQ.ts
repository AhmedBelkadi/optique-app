'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { faqFormSchema } from '@/features/faqs/schema/faqSchema';
import { validateCSRFToken } from '@/lib/csrf';
import { getAllFAQs } from '../services/getAllFAQs';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { requirePermission } from '@/lib/auth/authorization';

export interface CreateFAQState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: any;
  data?: any[];
}

export async function createFAQAction(prevState: CreateFAQState, 
  formData: FormData
): Promise<CreateFAQState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('faqs', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract form data
    const data = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
    };

    // Validate form data
    const validatedData = faqFormSchema.parse(data);

    // Get the next order number
    const maxOrder = await prisma.fAQ.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Create the FAQ
    const faq = await prisma.fAQ.create({
      data: {
        ...validatedData,
        order: nextOrder,
      },
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
    console.error('Error in createFAQAction:', error);
    
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
        values: {},
      };
    }
    
    return {
      success: false,
      error: 'Failed to create FAQ',
      fieldErrors: {},
      values: {},
    };
  }
}