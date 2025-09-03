'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { changeAppointmentStatus } from '@/features/appointments/services/changeAppointmentStatus';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export async function changeAppointmentStatusAction(prevState: any, formData: FormData): Promise<any> {
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
    const statusId = formData.get('statusId') as string;

    if (!appointmentId || !statusId) {
      return {
        success: false,
        error: 'ID du rendez-vous et statut requis'
      };
    }

    const result = await changeAppointmentStatus(appointmentId, statusId);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath(`/admin/appointments/${appointmentId}`);
    }

    return result;
  } catch (error) {
    console.error('Error in changeAppointmentStatusAction:', error);
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
      error: 'Erreur lors du changement de statut'
    };
  }
}
