'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateService } from '../services/updateService';
import { updateServiceSchema } from '../schema/serviceSchema';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';

export interface UpdateServiceState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
  };
  data?: any;
}

export async function updateServiceAction(
  prevState: UpdateServiceState,
  formData: FormData
): Promise<UpdateServiceState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('services', 'update');

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
        values: {
          name: formData.get('name') as string || '',
          description: formData.get('description') as string || '',
          icon: formData.get('icon') as string || '',
          isActive: formData.get('isActive') === 'true',
        },
      };
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      icon: formData.get('icon') as string || undefined,
      isActive: formData.get('isActive') === 'true',

    };

    // Validate data
    const validation = updateServiceSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
        values: {
          name: rawData.name,
          description: rawData.description || '',
          icon: rawData.icon || '',
          isActive: rawData.isActive,
          
        },
      };
    }

    // Update service
    const result = await updateService(id, validation.data);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          icon: '',
          isActive: true,

        },
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la mise à jour du service',
        fieldErrors: result.fieldErrors || {},
        values: {
          name: rawData.name,
          description: rawData.description || '',
          icon: rawData.icon || '',
          isActive: rawData.isActive,
          
        },
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string || '',
          icon: formData.get('icon') as string || '',
          isActive: formData.get('isActive') === 'true',
          
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string || '',
          icon: formData.get('icon') as string || '',
          isActive: formData.get('isActive') === 'true',
          
        },
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string || '',
          icon: formData.get('icon') as string || '',
          isActive: formData.get('isActive') === 'true',
          
        },
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'updateService',
      serviceId: formData.get('serviceId'),
      formData: {
        name: formData.get('name'),
        description: formData.get('description'),
        icon: formData.get('icon'),
        isActive: formData.get('isActive'),

      }
    });

    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite lors de la mise à jour du service',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string || '',
        icon: formData.get('icon') as string || '',
        isActive: formData.get('isActive') === 'true',
        
      },
    };
  }
}
