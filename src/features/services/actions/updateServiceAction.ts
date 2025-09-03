'use server';

import { revalidatePath } from 'next/cache';
import { updateService } from '../services/updateService';
import { updateServiceSchema } from '../schema/serviceSchema';
import { getCurrentUser } from '@/features/auth/services/session';

export interface UpdateServiceState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateServiceAction(
  id: string,
  prevState: UpdateServiceState,
  formData: FormData
): Promise<UpdateServiceState> {
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
      order: formData.get('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validate data
    const validation = updateServiceSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Update service
    const result = await updateService(id, validation.data);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la mise à jour du service',
        fieldErrors: result.fieldErrors,
      };
    }
  } catch (error) {
    console.error('Error in updateServiceAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du service',
    };
  }
}
