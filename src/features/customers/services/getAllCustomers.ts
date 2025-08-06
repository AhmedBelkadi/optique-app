import { prisma } from '@/lib/prisma';

interface GetAllCustomersParams {
  search?: string;
  isDeleted?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getAllCustomers({
  search,
  isDeleted = false,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 50,
}: GetAllCustomersParams = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      isDeleted,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              appointments: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: customers,
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
    console.error('Error getting customers:', error);
    return { success: false, error: 'Failed to get customers' };
  }
} 