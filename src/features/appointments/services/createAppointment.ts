import { prisma } from '@/lib/prisma';
import { AppointmentFormData } from '../schema/appointmentFormSchema';

export interface CreateAppointmentResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createAppointment(formData: AppointmentFormData): Promise<CreateAppointmentResult> {
  try {
    // Business hours validation is already done in the server action
    // No need to duplicate validation here
    
    // Parse date and time
    // formData.appointmentDate is already an ISO string from the server action
    const startTime = new Date(formData.appointmentDate);
    const endTime = new Date(startTime.getTime() + formData.duration * 60 * 1000);
    
    // Check for time conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        isDeleted: false,
        OR: [
          // Check if new appointment overlaps with existing ones
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return {
        success: false,
        error: 'Ce créneau horaire n\'est pas disponible. Veuillez choisir un autre horaire.'
      };
    }

    // Handle customer - either use existing or create new
    let customer;
    
    if (formData.customerId) {
      // Use existing customer
      customer = await prisma.customer.findFirst({
        where: {
          id: formData.customerId,
          isDeleted: false
        }
      });

      if (!customer) {
        return {
          success: false,
          error: 'Client sélectionné introuvable. Veuillez sélectionner un autre client.'
        };
      }
    } else {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          notes: formData.customerNotes || undefined
        }
      });
    }

    // Get default status (Scheduled)
    const defaultStatus = await prisma.appointmentStatus.findFirst({
      where: { name: 'scheduled', isActive: true }
    });

    if (!defaultStatus) {
      return {
        success: false,
        error: 'Erreur de configuration du système. Veuillez contacter l\'administrateur.'
      };
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        title: `Rendez-vous - ${formData.reason}`,
        description: formData.reason,
        startTime,
        endTime,
        statusId: defaultStatus.id,
        notes: formData.notes || undefined
      },
      include: {
        customer: true,
        status: true
      }
    });

    return {
      success: true,
      data: appointment
    };

  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.'
    };
  }
} 