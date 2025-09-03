'use server';

import { updateAppointment, UpdateAppointmentData } from '../services/updateAppointment';
import { getCurrentUser } from '@/features/auth/services/session';
import { revalidatePath } from 'next/cache';

export async function updateAppointmentAction(id: string, data: UpdateAppointmentData) {
  try {
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

    const result = await updateAppointment(id, data);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath(`/admin/appointments/${id}`);
    }

    return result;
  } catch (error) {
    console.error('Error in updateAppointmentAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du rendez-vous'
    };
  }
}
