import { z } from 'zod';

export const homeValuesSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  highlight: z.string().min(1, 'Highlight is required'),
  icon: z.string().min(1, 'Icon name is required'),
  order: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type HomeValues = z.infer<typeof homeValuesSchema>;

export const homeValuesFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  highlight: z.string().min(1, 'Highlight is required'),
  icon: z.string().min(1, 'Icon name is required'),
  order: z.number().default(0),
});

export type HomeValuesFormData = z.infer<typeof homeValuesFormSchema>;
