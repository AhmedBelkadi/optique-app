'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { manualSyncReviews } from '@/features/testimonials/services/autoSyncReviews';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function manualSyncReviewsAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('testimonials', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Trigger manual sync
    const result = await manualSyncReviews();

    if (result.success) {
      // Revalidate relevant paths
      revalidatePath('/admin/testimonials');
      revalidatePath('/testimonials');
      
      return {
        success: true,
        message: `Synchronisation terminée ! ${result.totalSynced} témoignages synchronisés.`,
        data: {
          totalSynced: result.totalSynced,
          google: result.google,
          facebook: result.facebook,
          timestamp: result.timestamp
        }
      };
    } else {
      return {
        success: false,
        error: 'Échec de la synchronisation des témoignages',
        data: result
      };
    }
  } catch (error) {
    console.error('Error in manualSyncReviewsAction:', error);
    
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
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la synchronisation',
      fieldErrors: {}
    };
  }
}
