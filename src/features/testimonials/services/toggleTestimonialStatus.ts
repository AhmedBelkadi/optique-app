import { prisma } from '@/lib/prisma';
import { sanitizeTestimonialData } from '../utils/testimonialValidation';

export async function toggleTestimonialStatus(id: string, newStatus: boolean) {
  try {
    // First, get the current testimonial to check if it's deleted
    const currentTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!currentTestimonial) {
      return {
        success: false,
        error: 'Témoignage non trouvé',
      };
    }

    // Cannot activate a deleted testimonial
    if (currentTestimonial.isDeleted && newStatus) {
      return {
        success: false,
        error: 'Impossible d\'activer un témoignage supprimé. Restaurez-le d\'abord.',
      };
    }

    // Sanitize the data to ensure consistency
    const sanitizedData = sanitizeTestimonialData({
      isActive: newStatus,
      updatedAt: new Date(),
    });

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: sanitizedData as any,
    });

    return { 
      success: true, 
      data: testimonial 
    };
  } catch (error) {
    console.error('Error toggling testimonial status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Échec de la modification du statut du témoignage' 
    };
  }
} 