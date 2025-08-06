import { prisma } from '@/lib/prisma';
import { CreateTestimonialInput } from '../schema/testimonialSchema';
import { testimonialSchema } from '../schema/testimonialSchema';

export async function createTestimonial(data: CreateTestimonialInput) {
  try {
    // Validate input
    const validatedData = testimonialSchema.create.parse(data);

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: validatedData,
    });

    return {
      success: true,
      data: testimonial,
    };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create testimonial',
    };
  }
} 