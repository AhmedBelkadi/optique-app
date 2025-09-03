import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  phone: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Format de numéro de téléphone invalide'),
  
  email: z.string()
    .email('Format d\'email invalide')
    .optional()
    .or(z.literal('')), // Allow empty string
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactFormState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string>;
  values: Partial<ContactFormData>;
}
