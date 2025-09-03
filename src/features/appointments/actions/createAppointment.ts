'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createAppointment } from '@/features/appointments/services/createAppointment';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { CreateAppointmentInput } from '../schema/appointmentSchema';

export async function createAppointmentAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const data: CreateAppointmentInput = {
      patientId: formData.get('patientId') as string,
      appointmentDate: formData.get('appointmentDate') as string,
      appointmentTime: formData.get('appointmentTime') as string,
      reason: formData.get('reason') as string,
      status: 'pending', // Default status
      notes: formData.get('notes') as string,
      doctorId: formData.get('doctorId') as string,
    };

    const result = await createAppointment(data);

    if (result.success) {
      revalidatePath('/admin/appointments');
      return {
        success: true,
        message: 'Appointment created successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to create appointment',
      };
    }
  } catch (error) {
    console.error('Error in createAppointmentAction:', error);
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