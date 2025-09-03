import { z } from 'zod';

// Base FAQ Contact CTA schema
export const faqContactCTASchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  contactButtonText: z.string().min(1, 'Contact button text is required'),
  contactButtonLink: z.string().min(1, 'Contact button link is required'),
  appointmentButtonText: z.string().min(1, 'Appointment button text is required'),
  appointmentButtonLink: z.string().min(1, 'Appointment button link is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// FAQ Contact CTA form schema (for create/update)
export const faqContactCTAFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  contactButtonText: z.string().min(1, 'Contact button text is required'),
  contactButtonLink: z.string().min(1, 'Contact button link is required'),
  appointmentButtonText: z.string().min(1, 'Appointment button text is required'),
  appointmentButtonLink: z.string().min(1, 'Appointment button link is required'),
});

// FAQ Contact CTA response schema
export const faqContactCTAResponseSchema = z.object({
  success: z.boolean(),
  data: faqContactCTASchema.optional(),
  error: z.string().optional(),
});

export type FAQContactCTA = z.infer<typeof faqContactCTASchema>;
export type FAQContactCTAFormData = z.infer<typeof faqContactCTAFormSchema>;
