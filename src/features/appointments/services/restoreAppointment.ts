import { prisma } from '@/lib/prisma';

export async function restoreAppointment(id: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Error restoring appointment:', error);
    return { success: false, error: 'Failed to restore appointment' };
  }
} 