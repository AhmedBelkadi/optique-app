import { prisma } from '@/lib/prisma';

export async function restoreTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return {
      success: true,
      data: testimonial,
    };
  } catch (error) {
    console.error('Error restoring testimonial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore testimonial',
    };
  }
} 