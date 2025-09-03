'use server';

import { revalidatePath } from 'next/cache';
import { deleteService } from '../services/deleteService';
import { getCurrentUser } from '@/features/auth/services/session';

export interface DeleteServiceState {
  success?: boolean;
  error?: string;
}

export async function deleteServiceAction(
  id: string,
  prevState: DeleteServiceState
): Promise<DeleteServiceState> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Non autorisé',
      };
    }

    // Delete service
    const result = await deleteService(id);
    
    if (result.success) {
      revalidatePath('/admin/services');
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la suppression du service',
      };
    }
  } catch (error) {
    console.error('Error in deleteServiceAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression du service',
    };
  }
}
