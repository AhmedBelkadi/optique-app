import { z } from 'zod';

export const aboutFloatingCTASchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  buttonText: z.string().min(1, 'Button text is required'),
  buttonLink: z.string().url('Valid URL is required'),
  isVisible: z.boolean().default(true),
  showOnScroll: z.boolean().default(false),
  scrollThreshold: z.number().default(100),
  isActive: z.boolean().default(true),
  position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left', 'center-left', 'center-right']).default('bottom-right'),
  buttonSize: z.enum(['sm', 'md', 'lg']).default('md'),
  buttonIcon: z.string().optional(),
});

export type AboutFloatingCTAInput = z.infer<typeof aboutFloatingCTASchema>;
export type AboutFloatingCTA = AboutFloatingCTAInput;
