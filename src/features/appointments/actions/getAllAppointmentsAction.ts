'use server';

import { getAllAppointments, GetAllAppointmentsOptions } from '../services/getAllAppointments';
import { requirePermission } from '@/lib/auth/authorization';

export async function getAllAppointmentsAction(options: GetAllAppointmentsOptions) {
  try {
 // 🔐 AUTHENTICATION CHECK - Ensure user is logged in

    requirePermission('appointments', 'read');

    return await getAllAppointments(options);
  } catch (error) {
    console.error('Error in getAllAppointmentsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des rendez-vous'
    };
  }
}