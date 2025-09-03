'use server';

import { getAppointment } from '../services/getAppointment';
import { getCurrentUser } from '@/features/auth/services/session';

export async function getAppointmentAction(id: string) {
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

    return await getAppointment(id);
  } catch (error) {
    console.error('Error in getAppointmentAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération du rendez-vous'
    };
  }
}
