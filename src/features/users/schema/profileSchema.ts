import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants';

export const profileSchema = {
  update: z.object({
    name: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères')
      .trim(),
    email: z
      .string()
      .email('Email invalide')
      .max(100, 'L\'email ne peut pas dépasser 100 caractères')
      .trim(),
    phone: z
      .string()
      .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')
      .optional()
      .nullable(),
  }),

  changePassword: z.object({
    currentPassword: z
      .string()
      .min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
      .string()
      .min(
        VALIDATION_CONSTANTS.auth.password.minLength,
        ERROR_MESSAGES.validation.minLength(VALIDATION_CONSTANTS.auth.password.minLength)
      )
      .max(
        VALIDATION_CONSTANTS.auth.password.maxLength,
        ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.password.maxLength)
      ),
    confirmPassword: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }),
};

export type ProfileUpdateInput = z.infer<typeof profileSchema.update>;
export type PasswordChangeInput = z.infer<typeof profileSchema.changePassword>;
