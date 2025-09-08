import { z } from 'zod';

// Site Settings Schema
export const siteSettingsSchema = z.object({
  siteName: z.string().nullable(),
  slogan: z.string().nullable(),
  logoUrl: z.string().nullable(),
  heroBackgroundImg: z.string().nullable(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

// Contact Settings Schema
export const contactSettingsSchema = z.object({
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  openingHours: z.string().optional(),
  googleMapsApiKey: z.string().optional(),
  whatsappChatLink: z.string().url('Invalid WhatsApp chat link').optional().or(z.literal('')),
  googleMapEmbed: z.string().optional(),
  googleMapLink: z.string().url('Invalid Google Maps link').optional().or(z.literal('')),
  instagramLink: z.string().url('Invalid Instagram link').optional().or(z.literal('')),
  facebookLink: z.string().url('Invalid Facebook link').optional().or(z.literal('')),
});

export type ContactSettings = z.infer<typeof contactSettingsSchema>;


// Theme Settings Schema
export const themeSettingsSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export type ThemeSettings = z.infer<typeof themeSettingsSchema>;

// Operational Settings Schema
export const operationalSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
});

export type OperationalSettings = z.infer<typeof operationalSettingsSchema>;

// Combined Settings Schema (for form submission)
export const combinedSettingsSchema = z.object({
  // Site Settings
  ...siteSettingsSchema.shape,
  
  // Contact Settings
  ...contactSettingsSchema.shape,
  
  
  // Theme Settings
  ...themeSettingsSchema.shape,
  
  // Operational Settings
  ...operationalSettingsSchema.shape,
});

export type CombinedSettings = z.infer<typeof combinedSettingsSchema>;

// Settings with timestamps for database operations
export type SiteSettingsWithTimestamps = SiteSettings & {
  createdAt: Date;
  updatedAt: Date;
};

export type ContactSettingsWithTimestamps = ContactSettings & {
  createdAt: Date;
  updatedAt: Date;
};



export type ThemeSettingsWithTimestamps = ThemeSettings & {
  createdAt: Date;
  updatedAt: Date;
};

export type OperationalSettingsWithTimestamps = OperationalSettings & {
  createdAt: Date;
  updatedAt: Date;
};

// Legacy type for backward compatibility (can be removed later)
export type SettingsWithTimestamps = CombinedSettings & {
  createdAt: Date;
  updatedAt: Date;
}; 