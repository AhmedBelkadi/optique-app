import { z } from 'zod';

export const aboutHeroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  backgroundImage: z.string().optional(),
});

export type AboutHeroInput = z.infer<typeof aboutHeroSchema>;
export type AboutHero = AboutHeroInput;
