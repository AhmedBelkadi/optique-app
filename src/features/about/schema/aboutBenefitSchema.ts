import { z } from 'zod';

export const aboutBenefitSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  highlight: z.string().min(1, 'Highlight is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  bgColor: z.string().min(1, 'Background color is required'),
  order: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AboutBenefit = z.infer<typeof aboutBenefitSchema>;

export const aboutBenefitFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  highlight: z.string().min(1, 'Highlight is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  bgColor: z.string().min(1, 'Background color is required'),
});

export type AboutBenefitFormData = z.infer<typeof aboutBenefitFormSchema>;
