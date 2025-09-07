import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
  
  email: z
    .string()
    .email('Format d\'email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .trim()
    .toLowerCase(),
  
  role: z
    .enum(['staff', 'admin'], {
      errorMap: () => ({ message: 'Le rôle doit être "staff" ou "admin"' })
    }),
  
  notes: z
    .string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional()
    .nullable()
    .transform(val => val || null),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Validation constants for user creation
export const USER_CREATION_CONSTANTS = {
  PASSWORD_LENGTH: 12,
  ALLOWED_ROLES: ['staff', 'admin'] as const,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_NOTES_LENGTH: 500,
} as const;

// Error messages for user creation
export const USER_CREATION_ERRORS = {
  VALIDATION_FAILED: 'Les données fournies ne sont pas valides',
  EMAIL_ALREADY_EXISTS: 'Un utilisateur avec cette adresse email existe déjà',
  INVALID_ROLE: 'Le rôle spécifié n\'est pas valide',
  USER_CREATION_FAILED: 'Échec de la création de l\'utilisateur',
  ROLE_ASSIGNMENT_FAILED: 'Échec de l\'attribution du rôle',
  EMAIL_SENDING_FAILED: 'Échec de l\'envoi de l\'email avec les identifiants',
  SESSION_NOT_FOUND: 'Session utilisateur non trouvée. Veuillez vous reconnecter',
  PERMISSION_DENIED: 'Vous n\'avez pas les permissions nécessaires pour créer des utilisateurs',
  RATE_LIMIT_EXCEEDED: 'Trop de tentatives. Veuillez patienter avant de réessayer',
  CSRF_ERROR: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer',
  UNEXPECTED_ERROR: 'Une erreur inattendue s\'est produite lors de la création de l\'utilisateur',
  SUCCESS: 'Utilisateur créé avec succès',
  SUCCESS_WITH_WARNING: 'Utilisateur créé avec succès, mais l\'envoi de l\'email a échoué',
} as const;
