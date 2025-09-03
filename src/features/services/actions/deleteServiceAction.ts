'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteService } from '../services/deleteService';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';

export interface DeleteServiceState {
  success?: boolean;
  error?: string;
}

export async function deleteServiceAction(
  prevState: DeleteServiceState,
  formData: FormData
): Promise<DeleteServiceState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('services', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Get service ID from form data
    const id = formData.get('serviceId') as string;
    if (!id) {
      return {
        success: false,
        error: 'Service ID is required',
      };
    }

    // Delete service
    const result = await deleteService(id);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la suppression du service',
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'deleteService',
      serviceId: formData.get('serviceId'),
    });

    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite lors de la suppression du service',
    };
  }
}
