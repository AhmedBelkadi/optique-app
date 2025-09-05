'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateAppointment } from '@/features/appointments/services/updateAppointment';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { UpdateAppointmentData } from '../services/updateAppointment';

export async function updateAppointmentAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('id') as string;
    const data: UpdateAppointmentData = {
      title: formData.get('title') as string || undefined,
      description: formData.get('description') as string || undefined,
      startTime: formData.get('startTime') as string || undefined,
      endTime: formData.get('endTime') as string || undefined,
      duration: formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined,
      statusId: formData.get('statusId') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      customerName: formData.get('customerName') as string || undefined,
      customerPhone: formData.get('customerPhone') as string || undefined,
      customerEmail: formData.get('customerEmail') as string || undefined,
      customerNotes: formData.get('customerNotes') as string || undefined,
    };

    const result = await updateAppointment(id, data);

    if (result.success) {
      revalidatePath('/admin/appointments');
      return {
        success: true,
        message: 'Appointment updated successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to update appointment',
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
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}