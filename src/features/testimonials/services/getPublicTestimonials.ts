import { prisma } from '@/lib/prisma';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';

export interface GetPublicTestimonialsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetPublicTestimonialsResult {
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

export async function getPublicTestimonials(options: GetPublicTestimonialsOptions = {}): Promise<GetPublicTestimonialsResult> {
  try {
    const { page = 1, limit = 12, search } = options;
    const skip = (page - 1) * limit;

    // Build where clause - only active, non-deleted testimonials
    const whereClause: any = {
      isActive: true,
      isDeleted: false,
    };

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

    // Get testimonials and total count
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
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
      data: testimonials.map(t => ({
        ...t,
        source: t.source as "internal" | "facebook" | "google" | "trustpilot",
        syncStatus: t.syncStatus as "pending" | "success" | "failed",
        externalData: t.externalData as { platform: string; reviewId: string; timestamp: Date; authorId?: string; helpful?: number } | null
      })),
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
    console.error('Error fetching public testimonials:', error);
    return {
      success: false,
      error: 'Failed to fetch testimonials',
    };
  }
}
