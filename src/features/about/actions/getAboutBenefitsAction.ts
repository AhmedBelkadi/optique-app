'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAboutBenefits } from '../services/getAboutBenefits';

export async function getAboutBenefitsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('about', 'read');

    return await getAboutBenefits();
  } catch (error) {
    console.error('Error in getAboutBenefitsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des avantages À propos'
    };
  }
}
