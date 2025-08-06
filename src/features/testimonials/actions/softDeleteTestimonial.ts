'use server';

import { revalidatePath } from 'next/cache';
import { softDeleteTestimonial } from '../services/softDeleteTestimonial';

export async function softDeleteTestimonialAction(id: string) {
  try {
    const result = await softDeleteTestimonial(id);

    if (result.success) {
      revalidatePath('/admin/testimonials');
      return {
        success: true,
        message: 'Testimonial deleted successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to delete testimonial',
      };
    }
  } catch (error) {
    console.error('Error in softDeleteTestimonialAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 