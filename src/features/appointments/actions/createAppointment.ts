'use server';

import { revalidatePath } from 'next/cache';
import { createAppointment } from '../services/createAppointment';
import { CreateAppointmentInput } from '../schema/appointmentSchema';

export async function createAppointmentAction(data: CreateAppointmentInput) {
  try {
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
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 