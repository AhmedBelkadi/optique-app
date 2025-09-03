'use server';

import { revalidatePath } from 'next/cache';
import { createService } from '../services/createService';
import { createServiceSchema } from '../schema/serviceSchema';
import { getCurrentUser } from '@/features/auth/services/session';

export interface CreateServiceState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: any;
}

export async function createServiceAction(
  prevState: CreateServiceState,
  formData: FormData
): Promise<CreateServiceState> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Non autorisé',
      };
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      icon: formData.get('icon') as string || undefined,
      isActive: formData.get('isActive') === 'true',
      order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
    };

    // Validate data
    const validation = createServiceSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Create service
    const result = await createService(validation.data);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la création du service',
        fieldErrors: result.fieldErrors,
      };
    }
  } catch (error) {
    console.error('Error in createServiceAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la création du service',
    };
  }
}
