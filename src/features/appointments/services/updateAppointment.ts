import { prisma } from '@/lib/prisma';
import { validateBusinessHours } from '../schema/appointmentFormSchema';

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

export interface UpdateAppointmentResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function updateAppointment(id: string, data: UpdateAppointmentData): Promise<UpdateAppointmentResult> {
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
          error: 'Les rendez-vous ne sont disponibles que du lundi au samedi, de 9h00 à 19h00.'
        };
      }
    }

    // Calculate end time if duration is provided
    let endTime = data.endTime;
    if (data.startTime && data.duration) {
      const startTime = new Date(data.startTime);
      endTime = new Date(startTime.getTime() + data.duration * 60 * 1000).toISOString();
    }

    // Check for time conflicts if time is being changed
    if (data.startTime && endTime) {
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: id }, // Exclude current appointment
          isDeleted: false,
          OR: [
            {
              AND: [
                { startTime: { lt: new Date(endTime) } },
                { endTime: { gt: new Date(data.startTime) } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        return {
          success: false,
          error: 'Ce créneau horaire est déjà occupé par un autre rendez-vous.'
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

    // Update customer if customer data is provided
    if (data.customerName || data.customerPhone || data.customerEmail || data.customerNotes) {
      const customerUpdateData: any = {};
      
      if (data.customerName !== undefined) customerUpdateData.name = data.customerName;
      if (data.customerPhone !== undefined) customerUpdateData.phone = data.customerPhone;
      if (data.customerEmail !== undefined) customerUpdateData.email = data.customerEmail;
      if (data.customerNotes !== undefined) customerUpdateData.notes = data.customerNotes;

      await prisma.customer.update({
        where: { id: existingAppointment.customerId },
        data: customerUpdateData
      });
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: appointmentUpdateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            notes: true
          }
        },
        status: {
          select: {
            id: true,
            name: true,
            displayName: true,
            color: true
          }
        }
      }
    });

    return {
      success: true,
      data: updatedAppointment
    };

  } catch (error) {
    console.error('Error updating appointment:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du rendez-vous'
    };
  }
}