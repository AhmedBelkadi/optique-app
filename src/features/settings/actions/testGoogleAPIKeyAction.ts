'use server';

import { apiRateLimit } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { z } from 'zod';
import { testGoogleAPIConnection } from '@/features/settings/services/externalAPISettingsService';

// Validation schema for Google API test
const googleAPITestSchema = z.object({
  apiKey: z.string().min(1, 'Clé API requise'),
  placeId: z.string().min(1, 'ID du lieu requis'),
});

export async function testGoogleAPIKeyAction(prevState: any, formData: FormData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
}> {
  try {
    // Rate limiting
    await apiRateLimit('testGoogleAPI');

    // CSRF validation
    try {
      await validateCSRFToken(formData);
    } catch (error) {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
      };
    }

    // Permission check
    await requirePermission('settings', 'read');

    // Extract and validate form data
    const data = {
      apiKey: formData.get('apiKey') as string,
      placeId: formData.get('placeId') as string,
    };

    const validationResult = googleAPITestSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données de formulaire invalides.',
      };
    }

    const { apiKey, placeId } = validationResult.data;

    // Test the Google Places API using the service
    const result = await testGoogleAPIConnection(apiKey, placeId);
    
    if (result.success) {
      return {
        success: true,
        message: 'Clé API Google valide !',
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Test de l\'API Google échoué',
      };
    }

  } catch (error) {
    console.error('Error testing Google API key:', error);
    
    // Handle permission errors specifically
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }

    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors du test de l\'API.',
    };
  }
}
