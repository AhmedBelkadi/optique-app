import { z } from 'zod';

// Base FAQ Hero schema
export const faqHeroSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// FAQ Hero form schema (for create/update)
export const faqHeroFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
});

// FAQ Hero response schema
export const faqHeroResponseSchema = z.object({
  success: z.boolean(),
  data: faqHeroSchema.optional(),
  error: z.string().optional(),
});

export type FAQHero = z.infer<typeof faqHeroSchema>;

export type FAQHeroFormData = z.infer<typeof faqHeroFormSchema>;
