import { prisma } from '@/lib/prisma';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';

export interface GetAllTestimonialsOptions {
  page?: number;
  limit?: number;
  search?: string;
  source?: 'internal' | 'facebook' | 'google' | 'trustpilot';
  isActive?: boolean;
  isVerified?: boolean;
  includeDeleted?: boolean;
  isDeleted?: boolean;
}

export interface GetAllTestimonialsResult {
  success: boolean;
  data?: Testimonial[];
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

export async function getAllTestimonials(options: GetAllTestimonialsOptions = {}): Promise<GetAllTestimonialsResult> {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      source, 
      isActive, 
      isVerified,
      includeDeleted = false,
      isDeleted 
    } = options;
    
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    // Handle deleted testimonials
    if (isDeleted !== undefined) {
      // If isDeleted is explicitly set, use that value
      whereClause.isDeleted = isDeleted;
    } else if (!includeDeleted) {
      // Default behavior: exclude deleted testimonials
      whereClause.isDeleted = false;
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Add source filter
    if (source) {
      whereClause.source = source;
    }

    // Add active status filter
    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    // Add verification status filter
    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified;
    }

    // Get testimonials and total count
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: whereClause,
        orderBy: [
          { isActive: 'desc' },
          { isVerified: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.testimonial.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      data: testimonials as Testimonial[],
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
    console.error('Error fetching all testimonials:', error);
    return {
      success: false,
      error: 'Failed to fetch testimonials',
    };
  }
}
