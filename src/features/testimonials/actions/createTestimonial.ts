'use server';

import { revalidatePath } from 'next/cache';
import { createTestimonial } from '../services/createTestimonial';
import { CreateTestimonialInput } from '../schema/testimonialSchema';

export async function createTestimonialAction(data: CreateTestimonialInput) {
  try {
    const result = await createTestimonial(data);

    if (result.success) {
      revalidatePath('/admin/testimonials');
      return {
        success: true,
        message: 'Testimonial created successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to create testimonial',
      };
    }
  } catch (error) {
    console.error('Error in createTestimonialAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 