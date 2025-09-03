'use server';

import { revalidatePath } from 'next/cache';
import { reorderServices } from '../services/reorderServices';
import { reorderServicesSchema } from '../schema/serviceSchema';
import { getCurrentUser } from '@/features/auth/services/session';

export interface ReorderServicesState {
  success?: boolean;
  error?: string;
}

export async function reorderServicesAction(
  services: Array<{ id: string; order: number }>,
  prevState: ReorderServicesState
): Promise<ReorderServicesState> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Non autorisé',
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
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la réorganisation des services',
      };
    }
  } catch (error) {
    console.error('Error in reorderServicesAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la réorganisation des services',
    };
  }
}
