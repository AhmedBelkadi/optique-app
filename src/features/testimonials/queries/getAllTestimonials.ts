import { prisma } from '@/lib/prisma';

interface GetAllTestimonialsParams {
  search?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getAllTestimonials({
  search,
  isActive,
  isDeleted = false,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10,
}: GetAllTestimonialsParams = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isDeleted,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get testimonials
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: testimonials,
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
    console.error('Error getting testimonials:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get testimonials',
      data: [],
      pagination: null,
    };
  }
} 