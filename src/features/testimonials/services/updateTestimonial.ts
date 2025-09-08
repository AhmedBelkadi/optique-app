import { prisma } from '@/lib/prisma';
import { UpdateTestimonialInput } from '../schema/testimonialSchema';
import { testimonialSchema } from '../schema/testimonialSchema';
import { deleteImage } from '@/lib/shared/utils/imageUploadUtils';

export async function updateTestimonial(id: string, data: UpdateTestimonialInput) {
  try {
    // Get existing testimonial to check for old image
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { image: true }
    });

    if (!existingTestimonial) {
      return { 
        success: false, 
        error: 'Témoignage non trouvé' 
      };
    }

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

    // Clean up old image if it was replaced
    if (existingTestimonial.image && validatedData.image && existingTestimonial.image !== validatedData.image) {
      await deleteImage(existingTestimonial.image);
    }

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