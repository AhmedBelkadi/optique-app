'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllBanners } from '../services/getAllBanners';

export async function getAllBannersAction() {
  try {
 // 🔐 AUTHENTICATION CHECK - Ensure user is logged in

    requirePermission('banners', 'read');

    return await getAllBanners();
  } catch (error) {
    console.error('Error in getAllBannersAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des bannières'
    };
  }
}