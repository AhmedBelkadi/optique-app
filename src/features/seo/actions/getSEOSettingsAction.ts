'use server';

import { getSEOSettings } from '@/features/settings/services/seoSettings';
import { requirePermission } from '@/lib/auth/authorization';

export async function getSEOSettingsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('seo', 'read');

    return await getSEOSettings();
  } catch (error) {
    console.error('Error in getSEOSettingsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des paramètres SEO'
    };
  }
}