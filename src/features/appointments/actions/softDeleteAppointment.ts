'use server';

import { revalidatePath } from 'next/cache';
import { softDeleteAppointment } from '../services/softDeleteAppointment';

export async function softDeleteAppointmentAction(id: string) {
  try {
    const result = await softDeleteAppointment(id);

    if (result.success) {
      revalidatePath('/admin/appointments');
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('Error in softDeleteAppointmentAction:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete appointment' 
    };
  }
} 