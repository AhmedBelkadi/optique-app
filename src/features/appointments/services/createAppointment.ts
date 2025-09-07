import { prisma } from '@/lib/prisma';
import { AppointmentFormData } from '../schema/appointmentFormSchema';
import { AppointmentServiceResult } from '../types';
import { 
  checkTimeConflicts, 
  getOrCreateCustomer, 
  getDefaultAppointmentStatus,
  createAppointmentWithRelations,
  calculateEndTime
} from '../utils/appointmentService';
import { APPOINTMENT_ERRORS } from '../types';

export async function createAppointment(formData: AppointmentFormData): Promise<AppointmentServiceResult> {
  try {
    // Parse date and time
    const startTime = new Date(formData.appointmentDate);
    const endTime = calculateEndTime(startTime, formData.duration);
    
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check for time conflicts
      const { hasConflict } = await checkTimeConflicts({ startTime, endTime });
      
      if (hasConflict) {
        throw new Error(APPOINTMENT_ERRORS.TIME_CONFLICT);
      }

      // Handle customer - either use existing or create new
      const customer = await getOrCreateCustomer(
        tx,
        formData.customerId,
        formData.customerId ? undefined : {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          notes: formData.customerNotes
        }
      );

      // Get default status
      const defaultStatus = await getDefaultAppointmentStatus(tx);

      // Create appointment
      return await createAppointmentWithRelations(tx, {
        customerId: customer.id,
        title: `Rendez-vous - ${formData.reason}`,
        description: formData.reason,
        startTime,
        endTime,
        statusId: defaultStatus.id,
        notes: formData.notes
      });
    });

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : APPOINTMENT_ERRORS.CREATE_ERROR
    };
  }
} 