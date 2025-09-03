'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertOperationalSettings } from '../services/operationalSettings';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm } from '@/lib/security';

export interface UpsertOperationalSettingsState {
  success: boolean;
  message: string;
  error?: string;
}

export async function upsertOperationalSettingsAction(prevState: UpsertOperationalSettingsState, formData: FormData): Promise<UpsertOperationalSettingsState> {
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
      'maintenanceMode', 'maintenanceMessage', 'businessHours', 'holidaySchedule',
      'appointmentSlots', 'maxAppointmentsPerDay', 'cancellationPolicy'
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
    const operationalData = {
      maintenanceMode: validation.sanitizedData.maintenanceMode === 'true',
      maintenanceMessage: validation.sanitizedData.maintenanceMessage || undefined,
      businessHours: validation.sanitizedData.businessHours || undefined,
      holidaySchedule: validation.sanitizedData.holidaySchedule || undefined,
      appointmentSlots: validation.sanitizedData.appointmentSlots || undefined,
      maxAppointmentsPerDay: validation.sanitizedData.maxAppointmentsPerDay ? parseInt(validation.sanitizedData.maxAppointmentsPerDay) : undefined,
      cancellationPolicy: validation.sanitizedData.cancellationPolicy || undefined,
    };

    const result = await upsertOperationalSettings(operationalData);

    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/settings');
      return {
        success: true,
        message: 'Paramètres opérationnels mis à jour avec succès !',
      };
    } else {
      return {
        success: false,
        message: 'Échec de la mise à jour des paramètres opérationnels',
        error: result.error || 'Erreur inconnue',
      };
    }
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
      action: 'upsertOperationalSettings', 
      identifier: await getClientIdentifier() 
    });
    
    return {
      success: false,
      message: 'Une erreur s\'est produite lors de la mise à jour des paramètres opérationnels',
      error: 'Erreur interne du serveur',
    };
  }
}