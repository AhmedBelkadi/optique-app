import { prisma } from '@/lib/prisma';
import { Testimonial } from '../schema/testimonialSchema';

export interface GetFeaturedTestimonialsResult {
  success: boolean;
  data?: Testimonial[];
  error?: string;
}

export async function getFeaturedTestimonials(limit: number = 3): Promise<GetFeaturedTestimonialsResult> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Transform the data to match our schema
    const transformedTestimonials: Testimonial[] = testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      message: testimonial.message,
      title: testimonial.title,
      image: testimonial.image,
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
      deletedAt: testimonial.deletedAt,
      isDeleted: testimonial.isDeleted,
    }));

    return {
      success: true,
      data: transformedTestimonials,
    };
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return {
      success: false,
      error: 'Failed to fetch featured testimonials',
    };
  }
}
