import { z } from 'zod';

// Base role validation schema
export const baseRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters long')
    .max(50, 'Role name cannot exceed 50 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Role name can only contain letters, numbers, spaces, hyphens, and underscores')
    .refine((val) => val.toLowerCase() !== 'admin', 'Cannot use "admin" as a role name'),
  
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional()
    .nullable()
    .transform(val => val || null),
  
  permissions: z
    .array(z.string().min(1, 'Permission ID cannot be empty'))
    .min(1, 'At least one permission is required')
    .max(100, 'Cannot assign more than 100 permissions to a single role'),
});

// Create role schema
export const createRoleSchema = baseRoleSchema;

// Update role schema
export const updateRoleSchema = baseRoleSchema.extend({
  roleId: z.string().min(1, 'Role ID is required'),
});

// Role operation constants
export const ROLE_CONSTANTS = {
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_PERMISSIONS_PER_ROLE: 100,
  RESERVED_ROLE_NAMES: ['admin', 'superadmin', 'root'],
} as const;

// Error messages for role operations
export const ROLE_ERRORS = {
  VALIDATION_FAILED: 'Les données fournies ne sont pas valides',
  ROLE_NOT_FOUND: 'Rôle non trouvé',
  ROLE_ALREADY_EXISTS: 'Un rôle avec ce nom existe déjà',
  ROLE_CREATION_FAILED: 'Échec de la création du rôle',
  ROLE_UPDATE_FAILED: 'Échec de la mise à jour du rôle',
  ROLE_DELETE_FAILED: 'Échec de la suppression du rôle',
  PERMISSION_NOT_FOUND: 'Une ou plusieurs permissions n\'existent pas',
  ROLE_IN_USE: 'Ce rôle est assigné à des utilisateurs et ne peut pas être supprimé',
  ADMIN_ROLE_PROTECTED: 'Le rôle administrateur ne peut pas être modifié ou supprimé',
  INVALID_PERMISSIONS: 'Permissions invalides fournies',
  SESSION_NOT_FOUND: 'Session utilisateur non trouvée. Veuillez vous reconnecter',
  PERMISSION_DENIED: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action',
  RATE_LIMIT_EXCEEDED: 'Trop de tentatives. Veuillez patienter avant de réessayer',
  CSRF_ERROR: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer',
  UNEXPECTED_ERROR: 'Une erreur inattendue s\'est produite',
  SUCCESS: 'Opération effectuée avec succès',
} as const;

// Type definitions
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
