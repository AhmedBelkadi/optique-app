'use server';

import { revalidatePath } from 'next/cache';
import { toggleTestimonialStatus } from '../services/toggleTestimonialStatus';

export async function toggleTestimonialStatusAction(id: string) {
  try {
    const result = await toggleTestimonialStatus(id);

    if (result.success) {
      revalidatePath('/admin/testimonials');
      return {
        success: true,
        message: 'Testimonial status updated successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to update testimonial status',
      };
    }
  } catch (error) {
    console.error('Error in toggleTestimonialStatusAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 