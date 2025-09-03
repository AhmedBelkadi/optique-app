'use server';

import { apiRateLimit } from '@/lib/rateLimit';
import { requirePermission } from '@/lib/auth/authorization';
import { getExternalAPISettings } from '@/features/settings/services/externalAPISettingsService';

export async function getExternalAPISettingsAction(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Rate limiting
    await apiRateLimit('getExternalAPISettings');

    // Permission check
    await requirePermission('settings', 'read');

    // Get settings from database
    const result = await getExternalAPISettings();
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Échec de la récupération de la configuration',
      };
    }

    return {
      success: true,
      data: result.data,
    };

  } catch (error) {
    console.error('Error getting external API settings:', error);
    
    // Handle permission errors specifically
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }

    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la récupération de la configuration.',
    };
  }
}
