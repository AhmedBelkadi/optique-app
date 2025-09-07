'use server';

import { checkAppointmentAvailability } from '../services/checkAppointmentAvailability';

export async function checkAppointmentAvailabilityAction(
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
) {
  try {
    const result = await checkAppointmentAvailability(
      new Date(startTime),
      new Date(endTime),
      excludeAppointmentId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error checking appointment availability:', error);
    return {
      success: false,
      error: 'Erreur lors de la vérification de disponibilité'
    };
  }
}
