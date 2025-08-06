import { prisma } from '@/lib/prisma';

export async function getTestimonialById(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return {
        success: false,
        error: 'Testimonial not found',
        data: null,
      };
    }

    return {
      success: true,
      data: testimonial,
    };
  } catch (error) {
    console.error('Error getting testimonial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get testimonial',
      data: null,
    };
  }
} 