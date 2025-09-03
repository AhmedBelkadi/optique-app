import { prisma } from '@/lib/prisma';

export interface GetAllAppointmentsOptions {
  search?: string;
  status?: string;
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

export async function getAllAppointments(options: GetAllAppointmentsOptions = {}): Promise<GetAllAppointmentsResult> {
  try {
    const {
      search,
      status,
      isDeleted = false,
      sortBy = 'startTime',
      sortOrder = 'asc',
      page = 1,
      limit = 50
    } = options;

    // Build where clause
    const where: any = {
      isDeleted
    };

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = {
        name: status
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.appointment.count({ where });
    console.log('Total appointments found:', total);

    // Get appointments
    const appointments = await prisma.appointment.findMany({
      where,
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
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });
    
    console.log('Appointments fetched:', appointments.length);

    // Calculate pagination info
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
        hasPrev
      }
    };

  } catch (error) {
    console.error('Error getting appointments:', error);
    return {
      success: false,
      error: 'Failed to fetch appointments'
    };
  }
}