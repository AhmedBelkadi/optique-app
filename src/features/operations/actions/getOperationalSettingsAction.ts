'use server';

import { getOperationalSettings } from '@/features/settings/services/operationalSettings';
import { requirePermission } from '@/lib/auth/authorization';

export async function getOperationalSettingsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    requirePermission('operations', 'read');

    return await getOperationalSettings();
  } catch (error) {
    console.error('Error in getOperationalSettingsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des paramètres opérationnels'
    };
  }
}
