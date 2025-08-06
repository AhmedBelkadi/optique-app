import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '../schema/appointmentSchema';

interface GetAllAppointmentsParams {
  search?: string;
  status?: AppointmentStatus;
  isDeleted?: boolean;
  sortBy?: 'startTime' | 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export async function getAllAppointments({
  search,
  status,
  isDeleted = false,
  sortBy = 'startTime',
  sortOrder = 'asc',
  page = 1,
  limit = 50,
  startDate,
  endDate,
}: GetAllAppointmentsParams = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      isDeleted,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { customer: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
      ...(status && { status }),
      ...(startDate && { startTime: { gte: startDate } }),
      ...(endDate && { endTime: { lte: endDate } }),
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error getting appointments:', error);
    return { success: false, error: 'Failed to get appointments' };
  }
} 