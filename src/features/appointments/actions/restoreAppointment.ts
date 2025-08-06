'use server';

import { revalidatePath } from 'next/cache';
import { restoreAppointment } from '../services/restoreAppointment';

export async function restoreAppointmentAction(id: string) {
  try {
    const result = await restoreAppointment(id);

    if (result.success) {
      revalidatePath('/admin/appointments');
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('Error in restoreAppointmentAction:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to restore appointment' 
    };
  }
} 