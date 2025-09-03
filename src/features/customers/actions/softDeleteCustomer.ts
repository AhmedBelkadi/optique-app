'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { softDeleteCustomer } from '@/features/customers/services/softDeleteCustomer';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function softDeleteCustomerAction(prevState: any, formData: FormData) {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
      await requirePermission('customers', 'delete');
 

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract customer ID
    const customerId = formData.get('customerId') as string;

    if (!customerId) {
      return {
        success: false,
        error: 'ID du client manquant',
        fieldErrors: {}
      };
    }

    // Soft delete the customer
    const result = await softDeleteCustomer(customerId);

    if (result.success) {
      // Revalidate relevant paths
      revalidatePath('/admin/customers');
      revalidatePath('/admin');
      
      return {
        success: true,
        message: 'Client supprimé avec succès !',
        fieldErrors: {}
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la suppression du client',
        fieldErrors: {}
      };
    }
  } catch (error) {
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
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la suppression du client. Veuillez réessayer.',
      fieldErrors: {}
    };
  }
}