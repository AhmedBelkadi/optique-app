'use server';

import { revalidatePath } from 'next/cache';
import { upsertSettings } from '../services/upsertSettings';
import { settingsSchema } from '../schema/settingsSchema';
import { validateCSRFToken } from '@/lib/csrf';

export async function upsertSettingsAction(prevState: any, formData: FormData) {
  try {
    // Validate CSRF token
    try {
      await validateCSRFToken(formData);
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request',
        fieldErrors: {},
      };
    }

    // Parse and validate form data
    const rawData = {
      siteName: formData.get('siteName') as string,
      slogan: formData.get('slogan') as string,
      logoUrl: formData.get('logoUrl') as string,
      heroImageUrl: formData.get('heroImageUrl') as string,
      primaryColor: formData.get('primaryColor') as string,
      secondaryColor: formData.get('secondaryColor') as string,
      contactEmail: formData.get('contactEmail') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string,
      address: formData.get('address') as string,
      openingHours: formData.get('openingHours') as string,
    };

    // Clean up empty strings
    const cleanedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [
        key,
        value === '' ? undefined : value,
      ])
    );

    const validation = settingsSchema.safeParse(cleanedData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });

      return {
        success: false,
        error: 'Validation failed',
        fieldErrors,
        values: cleanedData,
      };
    }

    // Save to database
    const result = await upsertSettings(validation.data);
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to save settings',
        values: cleanedData,
      };
    }

    // Revalidate the layout to update theme variables
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Settings saved successfully',
      data: result.data,
    };
  } catch (error) {
    console.error('Error in upsertSettingsAction:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
} 