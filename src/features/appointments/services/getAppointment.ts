import { prisma } from '@/lib/prisma';

export interface GetAppointmentResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getAppointment(id: string): Promise<GetAppointmentResult> {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        isDeleted: false
      },
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
            color: true,
            description: true
          }
        }
      }
    });

    if (!appointment) {
      return {
        success: false,
        error: 'Rendez-vous introuvable'
      };
    }

    return {
      success: true,
      data: appointment
    };

  } catch (error) {
    console.error('Error getting appointment:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération du rendez-vous'
    };
  }
}
