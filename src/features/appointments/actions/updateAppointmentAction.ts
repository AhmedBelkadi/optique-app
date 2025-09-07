'use server';

import { updateAppointment, UpdateAppointmentData } from '../services/updateAppointment';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';

export async function updateAppointmentAction(id: string, data: UpdateAppointmentData) {
  try {

    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
  // await validateCSRFToken(formData);

    const result = await updateAppointment(id, data);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath(`/admin/appointments/${id}`);
    }

    return result;
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
      error: 'Erreur lors de la mise à jour du rendez-vous'
    };
  }
}
