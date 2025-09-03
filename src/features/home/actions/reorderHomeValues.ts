'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { reorderHomeValues } from '../services/homeValuesService';

export async function reorderHomeValuesAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('home', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract IDs from formData
    const idsString = formData.get('ids') as string;
    if (!idsString) {
      return { success: false, error: 'IDs are required for reordering' };
    }
    
    const ids = JSON.parse(idsString);
    if (!Array.isArray(ids)) {
      return { success: false, error: 'Invalid IDs format' };
    }
    
    const result = await reorderHomeValues(ids);
    
    if (result.success) {
      revalidatePath('/admin');
      revalidatePath('/');
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in reorderHomeValuesAction:', error);
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
    }
    return { success: false, error: 'Une erreur est survenue lors de la réorganisation' };
  }
}
