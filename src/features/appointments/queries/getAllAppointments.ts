import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

export interface GetAllAppointmentsParams {
  search?: string;
  status?: AppointmentStatus;
  isDeleted?: boolean;
  sortBy?: 'startTime' | 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAllAppointmentsResult {
  success: boolean;
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export async function getAllAppointments({
  search,
  status,
  isDeleted = false,
  sortBy = 'startTime',
  sortOrder = 'asc',
  page = 1,
  limit = 50,
}: GetAllAppointmentsParams): Promise<GetAllAppointmentsResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isDeleted,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.appointment.count({ where });

    // Get appointments with pagination
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        status: true, // Include the status relation
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return {
      success: false,
      error: 'Failed to fetch appointments',
    };
  }
}
