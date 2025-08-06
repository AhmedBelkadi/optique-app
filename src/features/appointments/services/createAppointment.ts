import { prisma } from '@/lib/prisma';
import { CreateAppointmentInput } from '../schema/appointmentSchema';

export async function createAppointment(data: CreateAppointmentInput) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        customerId: data.customerId,
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: data.status,
        notes: data.notes,
      },
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
    console.error('Error creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
} 