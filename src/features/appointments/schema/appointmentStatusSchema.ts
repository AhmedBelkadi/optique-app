import { z } from 'zod';

export const appointmentStatusSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, 'Le nom est requis').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  displayName: z.string().min(1, 'Le nom d\'affichage est requis').max(100, 'Le nom d\'affichage ne peut pas dépasser 100 caractères'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'La couleur doit être au format hexadécimal valide').default('#6b7280'),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
});

export const createAppointmentStatusSchema = appointmentStatusSchema.omit({ id: true });
export const updateAppointmentStatusSchema = appointmentStatusSchema.partial().extend({
  id: z.string().cuid(),
});

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type CreateAppointmentStatus = z.infer<typeof createAppointmentStatusSchema>;
export type UpdateAppointmentStatus = z.infer<typeof updateAppointmentStatusSchema>;
