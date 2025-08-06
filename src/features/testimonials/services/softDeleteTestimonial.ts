import { prisma } from '@/lib/prisma';

export async function softDeleteTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      data: testimonial,
    };
  } catch (error) {
    console.error('Error soft deleting testimonial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete testimonial',
    };
  }
} 