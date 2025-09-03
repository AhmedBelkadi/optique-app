import { prisma } from '@/lib/prisma';

export interface ChangeAppointmentStatusResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function changeAppointmentStatus(appointmentId: string, statusId: string): Promise<ChangeAppointmentStatusResult> {
  try {
    // Verify appointment exists
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, isDeleted: false }
    });

    if (!appointment) {
      return {
        success: false,
        error: 'Rendez-vous introuvable'
      };
    }

    // Verify status exists and is active
    const status = await prisma.appointmentStatus.findFirst({
      where: { id: statusId, isActive: true }
    });

    if (!status) {
      return {
        success: false,
        error: 'Statut invalide'
      };
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { statusId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
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
    console.error('Error changing appointment status:', error);
    return {
      success: false,
      error: 'Erreur lors du changement de statut'
    };
  }
}

export async function getAppointmentStatuses() {
  try {
    const statuses = await prisma.appointmentStatus.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return {
      success: true,
      data: statuses
    };

  } catch (error) {
    console.error('Error getting appointment statuses:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des statuts'
    };
  }
}
