'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertContactSettings } from '@/features/settings/services/contactSettings';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm } from '@/lib/security';

export interface UpsertContactSettingsState {
  success: boolean;
  error: string;
  message?: string;
}

export async function upsertContactSettingsAction(prevState: UpsertContactSettingsState, formData: FormData): Promise<UpsertContactSettingsState> {
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
      'contactEmail', 'phone', 'whatsapp', 'address', 'city', 'openingHours',
      'googleMapsApiKey', 'whatsappChatLink', 'googleMapEmbed', 'googleMapLink',
      'instagramLink', 'facebookLink'
    ];
    
    const validation = validateAndSanitizePublicForm(formData, requiredFields, optionalFields);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation échouée: ${validation.errors.join(', ')}`
      };
    }

    // Extract and validate sanitized form data
    const contactData = {
      contactEmail: validation.sanitizedData.contactEmail || undefined,
      phone: validation.sanitizedData.phone || undefined,
      whatsapp: validation.sanitizedData.whatsapp || undefined,
      address: validation.sanitizedData.address || undefined,
      city: validation.sanitizedData.city || undefined,
      openingHours: validation.sanitizedData.openingHours || undefined,
      googleMapsApiKey: validation.sanitizedData.googleMapsApiKey || undefined,
      whatsappChatLink: validation.sanitizedData.whatsappChatLink || undefined,
      googleMapEmbed: validation.sanitizedData.googleMapEmbed || undefined,
      googleMapLink: validation.sanitizedData.googleMapLink || undefined,

      instagramLink: validation.sanitizedData.instagramLink || undefined,
      facebookLink: validation.sanitizedData.facebookLink || undefined,
    };

    // Save to database
    const result = await upsertContactSettings(contactData);
    
    if (result.success) {
      // Revalidate the home page to show updated settings
      revalidatePath('/');
      revalidatePath('/admin/settings');
      
      return {
        success: true,
        error: '',
        message: 'Paramètres de contact mis à jour avec succès',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la sauvegarde des paramètres de contact',
      };
    }
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Limite de taux')) {
        return {
          success: false,
          error: 'Trop de tentatives. Veuillez patienter avant de réessayer.'
        };
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
      
      if (error.message.includes('CSRF')) {
        return {
          success: false,
          error: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.'
        };
      }
      
      if (error.message.includes('Permission')) {
        return {
          success: false,
          error: 'Accès refusé. Privilèges insuffisants.'
        };
      }
    }
    
    // Log error for monitoring
    await logError(error as Error, { 
      action: 'upsertContactSettings', 
      identifier: await getClientIdentifier() 
    });
    
    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    };
  }
}