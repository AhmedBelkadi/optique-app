'use server';

import { apiRateLimit } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateExternalAPISettings } from '@/features/settings/services/externalAPISettingsService';

// Validation schema for external API keys
const externalAPIKeysSchema = z.object({
  googlePlacesApiKey: z.string().optional(),
  googlePlaceId: z.string().optional(),
  facebookAccessToken: z.string().optional(),
  facebookPageId: z.string().optional(),
  enableGoogleSync: z.boolean().default(false),
  enableFacebookSync: z.boolean().default(false),
});

export async function updateExternalAPIKeysAction(prevState: any, formData: FormData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  try {
    // Rate limiting
    await apiRateLimit('updateExternalAPIKeys');

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
    await requirePermission('settings', 'update');

    // Extract and validate form data
    const data = {
      googlePlacesApiKey: formData.get('googlePlacesApiKey') as string || '',
      googlePlaceId: formData.get('googlePlaceId') as string || '',
      facebookAccessToken: formData.get('facebookAccessToken') as string || '',
      facebookPageId: formData.get('facebookPageId') as string || '',
      enableGoogleSync: formData.get('enableGoogleSync') === 'true',
      enableFacebookSync: formData.get('enableFacebookSync') === 'true',
    };

    const validationResult = externalAPIKeysSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données de formulaire invalides.',
      };
    }

    // Save to database using the service
    const result = await updateExternalAPISettings(validationResult.data);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Échec de la sauvegarde de la configuration',
      };
    }
    
    // Revalidate relevant paths
    revalidatePath('/admin/content/operations');
    revalidatePath('/admin/testimonials');

    return {
      success: true,
      message: 'Configuration des API externes mise à jour avec succès !',
    };

  } catch (error) {
    console.error('Error updating external API keys:', error);
    
    // Handle permission errors specifically
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }

    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la mise à jour de la configuration.',
    };
  }
}
