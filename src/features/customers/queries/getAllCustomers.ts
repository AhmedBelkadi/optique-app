import { prisma } from '@/lib/prisma';

export interface GetAllCustomersParams {
  search?: string;
  isDeleted?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAllCustomersResult {
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

export async function getAllCustomers({
  search,
  isDeleted = false,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 50,
}: GetAllCustomersParams): Promise<GetAllCustomersResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isDeleted,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.customer.count({ where });

    // Get customers with pagination
    const customers = await prisma.customer.findMany({
      where,
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
      data: customers,
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
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: 'Failed to fetch customers',
    };
  }
}
