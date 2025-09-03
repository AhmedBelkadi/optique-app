'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteAppointment } from '../services/deleteAppointment';
import { getCurrentUser } from '@/features/auth/services/session';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth/authorization';

export async function deleteAppointmentAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // 🔐 AUTHENTICATION CHECK - Ensure user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      };
    }

    // 🔑 AUTHORIZATION CHECK - Ensure user has access
    if (!currentUser.isAdmin && !currentUser.isStaff) {
      return {
        success: false,
        error: 'Access denied. Insufficient privileges.',
      };
    }

    // Extract form data
    const appointmentId = formData.get('appointmentId') as string;
    const permanent = formData.get('permanent') === 'true';

    if (!appointmentId) {
      return {
        success: false,
        error: 'ID du rendez-vous requis'
      };
    }

    const result = await deleteAppointment(appointmentId, permanent);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath('/admin/appointments/trash');
    }

    return result;
  } catch (error) {
    console.error('Error in deleteAppointmentAction:', error);
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
      error: 'Erreur lors de la suppression du rendez-vous'
    };
  }
}
