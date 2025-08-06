'use server';

import { revalidatePath } from 'next/cache';
import { updateTestimonial } from '../services/updateTestimonial';
import { UpdateTestimonialInput } from '../schema/testimonialSchema';

export async function updateTestimonialAction(id: string, data: UpdateTestimonialInput) {
  try {
    const result = await updateTestimonial(id, data);

    if (result.success) {
      revalidatePath('/admin/testimonials');
      return {
        success: true,
        message: 'Testimonial updated successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to update testimonial',
      };
    }
  } catch (error) {
    console.error('Error in updateTestimonialAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 