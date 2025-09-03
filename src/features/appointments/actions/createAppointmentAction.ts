'use server';

import { createAppointment } from '../services/createAppointment';
import { AppointmentFormData } from '../schema/appointmentFormSchema';
import { revalidatePath } from 'next/cache';

export async function createAppointmentAction(formData: AppointmentFormData) {
  try {
    const result = await createAppointment(formData);
    
    if (result.success) {
      revalidatePath('/admin/appointments');
      return {
        success: true,
        message: 'Rendez-vous créé avec succès ! Nous vous confirmerons par WhatsApp dans les 24h.',
        data: result.data
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur lors de la création du rendez-vous'
      };
    }
  } catch (error) {
    console.error('Error in createAppointmentAction:', error);
    return {
      success: false,
      error: 'Une erreur inattendue est survenue. Veuillez réessayer.'
    };
  }
}
