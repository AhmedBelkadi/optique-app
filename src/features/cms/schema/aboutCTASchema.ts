import { z } from 'zod';

export const aboutCTASchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  buttonText: z.string().min(1, 'Button text is required'),
  buttonLink: z.string().url('Valid URL is required'),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
});

export type AboutCTAInput = z.infer<typeof aboutCTASchema>;
export type AboutCTA = AboutCTAInput;
