import { Testimonial } from '../schema/testimonialSchema';

/**
 * Validates testimonial state consistency
 * A testimonial cannot be both active and deleted
 */
export function validateTestimonialState(testimonial: Partial<Testimonial>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check logical consistency
  if (testimonial.isDeleted === true && testimonial.isActive === true) {
    errors.push('A testimonial cannot be both active and deleted');
  }

  // Check deletedAt consistency
  if (testimonial.isDeleted === true && !testimonial.deletedAt) {
    errors.push('Deleted testimonials must have a deletedAt date');
  }

  if (testimonial.isDeleted === false && testimonial.deletedAt) {
    errors.push('Non-deleted testimonials should not have a deletedAt date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes testimonial data to ensure consistency
 */
export function sanitizeTestimonialData(data: Partial<Testimonial>): Partial<Testimonial> {
  const sanitized = { ...data };

  // If deleted, ensure it's not active
  if (sanitized.isDeleted === true) {
    sanitized.isActive = false;
    if (!sanitized.deletedAt) {
      sanitized.deletedAt = new Date();
    }
  }

  // If not deleted, ensure deletedAt is null
  if (sanitized.isDeleted === false) {
    sanitized.deletedAt = null;
  }

  return sanitized;
}
