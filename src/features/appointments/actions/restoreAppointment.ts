'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { restoreAppointment } from '@/features/appointments/services/restoreAppointment';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function restoreAppointmentAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract form data
    const appointmentId = formData.get('appointmentId') as string;

    if (!appointmentId) {
      return {
        success: false,
        error: 'ID du rendez-vous requis'
      };
    }
    
    const result = await restoreAppointment(appointmentId);

    if (result.success) {
      revalidatePath('/admin/appointments');
      return {
        success: true,
        message: 'Appointment restored successfully',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to restore appointment',
      };
    }
  } catch (error) {
    console.error('Error in restoreAppointmentAction:', error);
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
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}