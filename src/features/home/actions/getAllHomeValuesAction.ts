'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllHomeValues } from '@/features/home/services/homeValuesService';

export async function getAllHomeValuesAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('home', 'read');

    return await getAllHomeValues();
  } catch (error) {
    console.error('Error in getAllHomeValuesAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des valeurs de la page d\'accueil'
    };
  }
}
