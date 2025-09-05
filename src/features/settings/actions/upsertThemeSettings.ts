'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertThemeSettings } from '@/features/settings/services/themeSettings';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';

export async function upsertThemeSettingsAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('settings', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract form data
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    
    // Prepare theme data
    const themeData = {
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
    };
    
    // Save theme settings
    const result = await upsertThemeSettings({
      primaryColor: themeData.primaryColor || undefined,
      secondaryColor: themeData.secondaryColor || undefined
    });
    
    if (result.success) {
      return {
        success: true,
        message: 'Theme settings updated successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update theme settings',
      };
    }
  } catch (error) {
    console.error('Error in upsertThemeSettingsAction:', error);
    if (error instanceof Error) {
      // Handle CSRF errors
      if (error.name === 'CSRFError') {
        return {
          success: false,
          error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
          message: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.'
        };
      }

      // Handle permission/authorization errors
      if (error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect error, likely due to permission issues
        return {
          success: false,
          error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
          message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.'
        };
      }
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}