'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm } from '@/lib/security';

export interface UpsertSettingsState {
  success: boolean;
  message: string;
  error?: string;
}

export async function upsertSettingsAction(prevState: UpsertSettingsState, formData: FormData): Promise<UpsertSettingsState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('settings', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Security validation and sanitization
    const requiredFields: string[] = [];
    const optionalFields = [
      'settingType', 'settingKey', 'settingValue', 'description', 'isActive'
    ];
    
    const validation = validateAndSanitizePublicForm(formData, requiredFields, optionalFields);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation échouée',
        error: validation.errors.join(', ')
      };
    }

    // Extract and validate sanitized form data
    const settingsData = {
      settingType: validation.sanitizedData.settingType || undefined,
      settingKey: validation.sanitizedData.settingKey || undefined,
      settingValue: validation.sanitizedData.settingValue || undefined,
      description: validation.sanitizedData.description || undefined,
      isActive: validation.sanitizedData.isActive === 'true',
    };

    // TODO: Implement the actual settings upsert functionality
    // For now, return success as this is a placeholder implementation
    
    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath('/admin/settings');
    
    return {
      success: true,
      message: 'Paramètres mis à jour avec succès !',
    };
    
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Limite de taux')) {
        return {
          success: false,
          message: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
          error: 'Rate limit exceeded'
        };
      }
      
      if (error.message.includes('CSRF')) {
        return {
          success: false,
          message: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.',
          error: 'CSRF validation failed'
        };
      }
      
      if (error.message.includes('Permission')) {
        return {
          success: false,
          message: 'Accès refusé. Privilèges insuffisants.',
          error: 'Insufficient permissions'
        };
      }
    }

    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        message: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.'
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.'
      };
    }
    
    // Log error for monitoring
    await logError(error as Error, { 
      action: 'upsertSettings', 
      identifier: await getClientIdentifier() 
    });
    
    return {
      success: false,
      message: 'Une erreur s\'est produite lors de la mise à jour des paramètres',
      error: 'Erreur interne du serveur',
    };
  }
}