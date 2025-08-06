'use server';

import { getAllAppointments } from '../services/getAllAppointments';
import { AppointmentStatus } from '../schema/appointmentSchema';

export async function getAllAppointmentsAction(params: {
  search?: string;
  status?: AppointmentStatus;
  isDeleted?: boolean;
  sortBy?: 'startTime' | 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const result = await getAllAppointments(params);
    return result;
  } catch (error) {
    console.error('Error in getAllAppointmentsAction:', error);
    return { success: false, error: 'Failed to get appointments' };
  }
} 