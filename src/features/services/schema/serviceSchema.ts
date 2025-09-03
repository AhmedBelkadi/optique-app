import { z } from 'zod';

// Base Service schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom du service est requis'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean().default(false),
});

// Create Service schema
export const createServiceSchema = z.object({
  name: z.string().min(1, 'Le nom du service est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  icon: z.string().max(50, 'Le nom de l\'icône ne peut pas dépasser 50 caractères').optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// Update Service schema
export const updateServiceSchema = z.object({
  name: z.string().min(1, 'Le nom du service est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères').optional(),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  icon: z.string().max(50, 'Le nom de l\'icône ne peut pas dépasser 50 caractères').optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// Reorder Services schema
export const reorderServicesSchema = z.object({
  services: z.array(z.object({
    id: z.string(),
    order: z.number().int().min(0),
  })).min(1, 'Au moins un service est requis'),
});

// Types
export type Service = z.infer<typeof serviceSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ReorderServicesInput = z.infer<typeof reorderServicesSchema>;

// Serialized Service type for client components
export type SerializedService = Omit<Service, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
