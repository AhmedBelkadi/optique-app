'use server';

import { revalidatePath } from 'next/cache';
import { restoreTestimonial } from '../services/restoreTestimonial';

export async function restoreTestimonialAction(id: string) {
  try {
    const result = await restoreTestimonial(id);

    if (result.success) {
      revalidatePath('/admin/testimonials');
      return {
        success: true,
        message: 'Testimonial restored successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to restore testimonial',
      };
    }
  } catch (error) {
    console.error('Error in restoreTestimonialAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 