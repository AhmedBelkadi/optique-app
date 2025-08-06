import { prisma } from '@/lib/prisma';

export async function softDeleteAppointment(id: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Error soft deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
} 