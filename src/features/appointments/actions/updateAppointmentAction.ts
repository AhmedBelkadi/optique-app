'use server';

import { updateAppointment, UpdateAppointmentData } from '../services/updateAppointment';
import { AppointmentActionResult, APPOINTMENT_ERRORS } from '../types';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';

export async function updateAppointmentAction(id: string, data: UpdateAppointmentData & { csrf_token?: string }): Promise<AppointmentActionResult> {
  try {

    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    if (data.csrf_token) {
      const formDataForCSRF = new FormData();
      formDataForCSRF.append('csrf_token', data.csrf_token);
      await validateCSRFToken(formDataForCSRF);
    }

    const result = await updateAppointment(id, data);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath(`/admin/appointments/${id}`);
      return {
        success: true,
        message: APPOINTMENT_ERRORS.UPDATE_SUCCESS,
        data: result.data
      };
    } else {
      return {
        success: false,
        error: result.error || APPOINTMENT_ERRORS.UPDATE_ERROR,
        fieldErrors: {}
      };
    }
  } catch (error) {
    console.error('Error in updateAppointmentAction:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }
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
      error: APPOINTMENT_ERRORS.UPDATE_ERROR,
      fieldErrors: {}
    };
  }
}
