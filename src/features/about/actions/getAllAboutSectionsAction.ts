'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllAboutSections } from '../services/getAllAboutSections';

export async function getAllAboutSectionsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('about', 'read');

    return await getAllAboutSections();
  } catch (error) {
    console.error('Error in getAllAboutSectionsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des sections À propos'
    };
  }
}
