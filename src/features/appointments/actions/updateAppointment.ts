'use server';

import { revalidatePath } from 'next/cache';
import { updateAppointment } from '../services/updateAppointment';
import { UpdateAppointmentInput } from '../schema/appointmentSchema';

export async function updateAppointmentAction(id: string, data: UpdateAppointmentInput) {
  try {
    const result = await updateAppointment(id, data);

    if (result.success) {
      revalidatePath('/admin/appointments');
      revalidatePath(`/admin/appointments/${id}`);
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
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 