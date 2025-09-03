'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllCategories } from '../services/getAllCategories';

export async function getAllCategoriesAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('categories', 'read');

    return await getAllCategories();
  } catch (error) {
    console.error('Error in getAllCategoriesAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des catégories'
    };
  }
}
