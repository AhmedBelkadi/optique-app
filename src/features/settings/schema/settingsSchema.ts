import { z } from 'zod';

export const settingsSchema = z.object({
  siteName: z.string().nullable().optional(),
  slogan: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  heroImageUrl: z.string().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  secondaryColor: z.string().nullable().optional(),
  contactEmail: z.string().email('Invalid email address').nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  openingHours: z.string().nullable().optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

export interface SettingsWithTimestamps extends Settings {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 