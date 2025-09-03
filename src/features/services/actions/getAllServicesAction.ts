'use server';

import { revalidatePath } from 'next/cache';
import { getAllServices } from '../services/getAllServices';
import { getCurrentUser } from '@/features/auth/services/session';

export async function getAllServicesAction() {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Non autorisé',
      };
    }

    const result = await getAllServices();
    return result;
  } catch (error) {
    console.error('Error in getAllServicesAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des services',
    };
  }
}
