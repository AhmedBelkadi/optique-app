import { prisma } from '@/lib/prisma';
import { UpdateTestimonialInput } from '../schema/testimonialSchema';
import { testimonialSchema } from '../schema/testimonialSchema';

export async function updateTestimonial(id: string, data: UpdateTestimonialInput) {
  try {
    // Validate input data
    const validatedData = testimonialSchema.update.parse(data);

    // Update testimonial
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return { 
      success: true, 
      data: testimonial 
    };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Échec de la mise à jour du témoignage' 
    };
  }
} 