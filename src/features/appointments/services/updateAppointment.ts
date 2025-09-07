import { prisma } from '@/lib/prisma';
import { validateBusinessHours } from '../schema/appointmentFormSchema';
import { AppointmentServiceResult, APPOINTMENT_ERRORS } from '../types';
import { 
  checkTimeConflicts, 
  updateAppointmentWithRelations,
  calculateEndTime
} from '../utils/appointmentService';

export interface UpdateAppointmentData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  statusId?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNotes?: string;
}

export async function updateAppointment(id: string, data: UpdateAppointmentData): Promise<AppointmentServiceResult> {
  try {
    // Get existing appointment
    const existingAppointment = await prisma.appointment.findFirst({
      where: { id, isDeleted: false },
      include: { customer: true }
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Rendez-vous introuvable'
      };
    }

    // Validate business hours if date/time is being updated
    if (data.startTime) {
      const appointmentDate = data.startTime.split('T')[0];
      const appointmentTime = data.startTime.split('T')[1];
      
      if (!validateBusinessHours(appointmentDate, appointmentTime)) {
        return {
          success: false,
          error: APPOINTMENT_ERRORS.BUSINESS_HOURS
        };
      }
    }

    // Calculate end time if duration is provided
    let endTime = data.endTime;
    if (data.startTime && data.duration) {
      const startTime = new Date(data.startTime);
      endTime = calculateEndTime(startTime, data.duration).toISOString();
    }

    // Check for time conflicts if time is being changed
    if (data.startTime && endTime) {
      const { hasConflict } = await checkTimeConflicts({
        startTime: new Date(data.startTime),
        endTime: new Date(endTime),
        excludeAppointmentId: id
      });

      if (hasConflict) {
        return {
          success: false,
          error: APPOINTMENT_ERRORS.TIME_CONFLICT
        };
      }
    }

    // Prepare appointment update data
    const appointmentUpdateData: any = {};
    
    if (data.title !== undefined) appointmentUpdateData.title = data.title;
    if (data.description !== undefined) appointmentUpdateData.description = data.description;
    if (data.startTime !== undefined) appointmentUpdateData.startTime = new Date(data.startTime);
    if (endTime !== undefined) appointmentUpdateData.endTime = new Date(endTime);
    if (data.statusId !== undefined) appointmentUpdateData.statusId = data.statusId;
    if (data.notes !== undefined) appointmentUpdateData.notes = data.notes;

    // Prepare customer update data
    const customerUpdateData: any = {};
    if (data.customerName !== undefined) customerUpdateData.name = data.customerName;
    if (data.customerPhone !== undefined) customerUpdateData.phone = data.customerPhone;
    if (data.customerEmail !== undefined) customerUpdateData.email = data.customerEmail;
    if (data.customerNotes !== undefined) customerUpdateData.notes = data.customerNotes;

    // Use transaction to ensure data consistency
    const updatedAppointment = await prisma.$transaction(async (tx) => {
      return await updateAppointmentWithRelations(
        tx,
        id,
        appointmentUpdateData,
        Object.keys(customerUpdateData).length > 0 ? customerUpdateData : undefined
      );
    });

    return {
      success: true,
      data: updatedAppointment
    };

  } catch (error) {
    console.error('Error updating appointment:', error);
    return {
      success: false,
      error: APPOINTMENT_ERRORS.UPDATE_ERROR
    };
  }
}