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
    
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check for time conflicts
      const conflictingAppointment = await tx.appointment.findFirst({
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
        throw new Error('Ce créneau horaire n\'est pas disponible. Veuillez choisir un autre horaire.');
      }

      // Handle customer - either use existing or create new
      let customer;
      
      if (formData.customerId) {
        // Use existing customer
        customer = await tx.customer.findFirst({
          where: {
            id: formData.customerId,
            isDeleted: false
          }
        });

        if (!customer) {
          throw new Error('Client sélectionné introuvable. Veuillez sélectionner un autre client.');
        }
      } else {
        // Create new customer
        customer = await tx.customer.create({
          data: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            notes: formData.customerNotes || undefined
          }
        });
      }

      // Get default status (Scheduled)
      const defaultStatus = await tx.appointmentStatus.findFirst({
        where: { name: 'scheduled', isActive: true }
      });

      if (!defaultStatus) {
        throw new Error('Erreur de configuration du système. Veuillez contacter l\'administrateur.');
      }

      // Create appointment
      const appointment = await tx.appointment.create({
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

      return appointment;
    });

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.'
    };
  }
} 