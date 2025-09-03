'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { softDeleteTestimonial } from '@/features/testimonials/services/softDeleteTestimonial';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function softDeleteTestimonialAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('testimonials', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const testimonialId = formData.get('testimonialId') as string;
    
    if (!testimonialId) {
      return {
        success: false,
        error: 'ID du témoignage manquant',
        fieldErrors: {}
      };
    }
    
    const result = await softDeleteTestimonial(testimonialId);

    if (result.success && result.data) {
      // Revalidate relevant paths
      revalidatePath('/admin/testimonials');
      revalidatePath('/testimonials');
      
      return {
        success: true,
        message: 'Témoignage supprimé avec succès !',
        data: result.data,
        fieldErrors: {}
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la suppression du témoignage',
        fieldErrors: {}
      };
    }
  } catch (error) {
    console.error('Error in softDeleteTestimonialAction:', error);
    
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {}
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la suppression du témoignage',
      fieldErrors: {}
    };
  }
} 