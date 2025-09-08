import { z } from 'zod';

export const aboutSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  order: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AboutSection = z.infer<typeof aboutSectionSchema>;

export const aboutSectionFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export type AboutSectionFormData = z.infer<typeof aboutSectionFormSchema>;
