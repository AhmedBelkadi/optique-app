'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { reorderServices } from '../services/reorderServices';
import { reorderServicesSchema } from '../schema/serviceSchema';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';

export interface ReorderServicesState {
  success?: boolean;
  error?: string;
  data?: any;
}

export async function reorderServicesAction(
  prevState: ReorderServicesState,
  formData: FormData
): Promise<ReorderServicesState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('services', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract services data from FormData
    const services: Array<{ id: string; order: number }> = [];
    let index = 0;
    
    while (formData.has(`services[${index}][id]`)) {
      const id = formData.get(`services[${index}][id]`) as string;
      const order = parseInt(formData.get(`services[${index}][order]`) as string);
      
      if (id && !isNaN(order)) {
        services.push({ id, order });
      }
      index++;
    }

    if (services.length === 0) {
      return {
        success: false,
        error: 'Aucun service à réorganiser',
      };
    }

    // Validate data
    const validation = reorderServicesSchema.safeParse({ services });
    if (!validation.success) {
      return {
        success: false,
        error: 'Données de réorganisation invalides',
      };
    }

    // Reorder services
    const result = await reorderServices(validation.data);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
        error: '',
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la réorganisation des services',
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
      action: 'reorderServices',
      formData: Array.from(formData.entries()),
    });

    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite lors de la réorganisation des services',
    };
  }
}
