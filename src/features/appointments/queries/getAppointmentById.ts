import { prisma } from '@/lib/prisma';

export interface GetAppointmentByIdResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getAppointmentById(id: string): Promise<GetAppointmentByIdResult> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        status: true, // Include the status relation
      },
    });

    if (!appointment) {
      return {
        success: false,
        error: 'Appointment not found',
      };
    }

    return {
      success: true,
      data: appointment,
    };
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return {
      success: false,
      error: 'Failed to fetch appointment',
    };
  }
}
