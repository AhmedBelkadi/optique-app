'use server';

import { createAppointment } from '../services/createAppointment';
import { AppointmentFormData } from '../schema/appointmentFormSchema';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';

export async function createAppointmentAction(formData: AppointmentFormData & { csrf_token?: string }) {
  try {

    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    if (formData.csrf_token) {
      const formDataForCSRF = new FormData();
      formDataForCSRF.append('csrf_token', formData.csrf_token);
      await validateCSRFToken(formDataForCSRF);
    }


    const result = await createAppointment(formData);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      return {
        success: true,
        message: 'Rendez-vous créé avec succès ! Nous vous confirmerons par WhatsApp dans les 24h.',
        data: result.data
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la création du rendez-vous'
      };
    }
  } catch (error) {
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }
    console.error('Error in createAppointmentAction:', error);
    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {}
      };
    }
    return {
      success: false,
      error: 'Une erreur inattendue est survenue. Veuillez réessayer.'
    };
  }
}
