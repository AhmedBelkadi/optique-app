'use server';

import { apiRateLimit } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { z } from 'zod';
import { testFacebookAPIConnection } from '@/features/settings/services/externalAPISettingsService';

// Validation schema for Facebook API test
const facebookAPITestSchema = z.object({
  accessToken: z.string().min(1, 'Token d\'accès requis'),
  pageId: z.string().min(1, 'ID de la page requis'),
});

export async function testFacebookAPIKeyAction(prevState: any, formData: FormData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
}> {
  try {
    // Rate limiting
    await apiRateLimit('testFacebookAPI');

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
      accessToken: formData.get('accessToken') as string,
      pageId: formData.get('pageId') as string,
    };

    const validationResult = facebookAPITestSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données de formulaire invalides.',
      };
    }

    const { accessToken, pageId } = validationResult.data;

    // Test the Facebook Graph API using the service
    const result = await testFacebookAPIConnection(accessToken, pageId);
    
    if (result.success) {
      return {
        success: true,
        message: 'Token Facebook valide !',
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Test de l\'API Facebook échoué',
      };
    }

  } catch (error) {
    console.error('Error testing Facebook API key:', error);
    
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
