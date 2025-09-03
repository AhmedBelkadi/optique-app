import { prisma } from '@/lib/prisma';
import { sanitizeTestimonialData } from '../utils/testimonialValidation';

export async function softDeleteTestimonial(id: string) {
  try {
    // Sanitize the data to ensure consistency
    const sanitizedData = sanitizeTestimonialData({
      isDeleted: true,
      isActive: false, // When deleted, it should not be active
      deletedAt: new Date(),
    });

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: sanitizedData,
    });

    return { success: true, data: testimonial };
  } catch (error) {
    console.error('Error soft deleting testimonial:', error);
    return { success: false, error: 'Échec de la suppression du témoignage' };
  }
} 