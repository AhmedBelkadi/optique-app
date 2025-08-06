import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants';

const { testimonials } = VALIDATION_CONSTANTS;
const { validation, testimonials: testimonialErrors } = ERROR_MESSAGES;

export const testimonialSchema = {
  create: z.object({
    name: z
      .string()
      .min(testimonials.name.minLength, validation.required)
      .max(testimonials.name.maxLength, validation.maxLength(testimonials.name.maxLength)),
    message: z
      .string()
      .min(testimonials.message.minLength, validation.required)
      .max(testimonials.message.maxLength, validation.maxLength(testimonials.message.maxLength)),
    title: z
      .string()
      .max(testimonials.title.maxLength, validation.maxLength(testimonials.title.maxLength))
      .optional(),
    image: z
      .string()
      .optional(),
    isActive: z
      .boolean()
      .default(true),
  }),

  update: z.object({
    name: z
      .string()
      .min(testimonials.name.minLength, validation.required)
      .max(testimonials.name.maxLength, validation.maxLength(testimonials.name.maxLength))
      .optional(),
    message: z
      .string()
      .min(testimonials.message.minLength, validation.required)
      .max(testimonials.message.maxLength, validation.maxLength(testimonials.message.maxLength))
      .optional(),
    title: z
      .string()
      .max(testimonials.title.maxLength, validation.maxLength(testimonials.title.maxLength))
      .optional(),
    image: z
      .string()
      .optional(),
    isActive: z
      .boolean()
      .optional(),
  }),

  testimonial: z.object({
    id: z.string(),
    name: z.string(),
    message: z.string(),
    title: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    isDeleted: z.boolean(),
  }),
};

export type CreateTestimonialInput = z.infer<typeof testimonialSchema.create>;
export type UpdateTestimonialInput = z.infer<typeof testimonialSchema.update>;
export type Testimonial = z.infer<typeof testimonialSchema.testimonial>; 