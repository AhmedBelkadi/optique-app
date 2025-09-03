import { prisma } from '@/lib/prisma';

export async function restoreTestimonial(id: string) {
  try {
    // First, get the current testimonial to check its previous state
    const currentTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!currentTestimonial) {
      return {
        success: false,
        error: 'Témoignage non trouvé',
      };
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        isDeleted: false,
        isActive: true, // When restored, set to active by default
        deletedAt: null,
        updatedAt: new Date(),
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
      error: error instanceof Error ? error.message : 'Échec de la restauration du témoignage',
    };
  }
} 