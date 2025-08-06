import { prisma } from '@/lib/prisma';
import { UpdateAppointmentInput } from '../schema/appointmentSchema';

export async function updateAppointment(id: string, data: UpdateAppointmentInput) {
  try {
    const updateData: any = {
      title: data.title,
      description: data.description,
      status: data.status,
      notes: data.notes,
      updatedAt: new Date(),
    };

    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      updateData.endTime = new Date(data.endTime);
    }
    if (data.customerId) {
      updateData.customerId = data.customerId;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
} 