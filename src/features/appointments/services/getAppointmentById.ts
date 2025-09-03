import { prisma } from '@/lib/prisma';

export async function getAppointmentById(id: string) {
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
      return { success: false, error: 'Appointment not found' };
    }

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Error getting appointment:', error);
    return { success: false, error: 'Failed to get appointment' };
  }
} 