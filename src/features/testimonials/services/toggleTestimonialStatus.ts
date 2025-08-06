import { prisma } from '@/lib/prisma';

export async function toggleTestimonialStatus(id: string) {
  try {
    // Get current status
    const current = await prisma.testimonial.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!current) {
      return {
        success: false,
        error: 'Testimonial not found',
      };
    }

    // Toggle status
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        isActive: !current.isActive,
      },
    });

    return {
      success: true,
      data: testimonial,
    };
  } catch (error) {
    console.error('Error toggling testimonial status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle testimonial status',
    };
  }
} 