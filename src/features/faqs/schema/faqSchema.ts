import { z } from 'zod';

// Base FAQ schema
export const faqSchema = z.object({
  id: z.string().cuid(),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  order: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// FAQ form schema (for create/update)
export const faqFormSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export type FAQFormData = z.infer<typeof faqFormSchema>;
export type FAQ = z.infer<typeof faqSchema>;

// FAQ list schema
export const faqListSchema = z.array(faqSchema);

// FAQ grouped by theme schema
export const faqGroupedSchema = z.record(z.string(), z.array(faqSchema));

// FAQ response schema
export const faqResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(faqSchema).optional(),
  groupedData: faqGroupedSchema.optional(),
  error: z.string().optional(),
});
