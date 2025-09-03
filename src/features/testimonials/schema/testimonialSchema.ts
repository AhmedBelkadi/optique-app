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
    rating: z
      .number()
      .min(1, 'La note doit être comprise entre 1 et 5')
      .max(5, 'La note doit être comprise entre 1 et 5'),
    source: z
      .enum(['internal', 'facebook', 'google', 'trustpilot'])
      .default('internal'),
    externalId: z
      .string()
      .optional(),
    externalUrl: z
      .string()
      .url('L\'URL externe doit être valide')
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
      .default(true),
    isVerified: z
      .boolean()
      .default(false),
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
    rating: z
      .number()
      .min(1, 'La note doit être comprise entre 1 et 5')
      .max(5, 'La note doit être comprise entre 1 et 5')
      .optional(),
    source: z
      .enum(['internal', 'facebook', 'google', 'trustpilot'])
      .optional(),
    externalId: z
      .string()
      .optional(),
    externalUrl: z
      .string()
      .url('L\'URL externe doit être valide')
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
    isVerified: z
      .boolean()
      .optional(),
  }),

  testimonial: z.object({
    id: z.string(),
    name: z.string(),
    message: z.string(),
    rating: z.number(),
    source: z.enum(['internal', 'facebook', 'google', 'trustpilot']),
    externalId: z.string().nullable(),
    externalUrl: z.string().nullable(),
    externalData: z.object({
      platform: z.string(),
      reviewId: z.string(),
      authorId: z.string().optional(),
      timestamp: z.date(),
      helpful: z.number().optional(),
    }).nullable(),
    title: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    isVerified: z.boolean(),
    isSynced: z.boolean(),
    lastSynced: z.date().nullable(),
    syncStatus: z.enum(['pending', 'success', 'failed']),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    isDeleted: z.boolean(),
  }),
};

export type CreateTestimonialInput = z.infer<typeof testimonialSchema.create>;
export type UpdateTestimonialInput = z.infer<typeof testimonialSchema.update>;
export type Testimonial = z.infer<typeof testimonialSchema.testimonial>;

// Serialized version for client components (dates as strings)
export type SerializedTestimonial = Omit<Testimonial, 'createdAt' | 'updatedAt' | 'deletedAt' | 'lastSynced' | 'externalData'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastSynced: string | null;
  externalData: {
    platform: string;
    reviewId: string;
    authorId?: string;
    timestamp: string;
    helpful?: number;
  } | null;
}; 