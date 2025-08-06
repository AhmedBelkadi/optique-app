import { prisma } from '@/lib/prisma';
import { SettingsWithTimestamps } from '../schema/settingsSchema';

export async function getSettings(): Promise<{
  success: boolean;
  data?: SettingsWithTimestamps;
  error?: string;
}> {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.settings.create({
        data: {
          id: 'singleton',
          siteName: 'Optique',
          slogan: 'Your Vision, Our Expertise',
        },
      });

      return {
        success: true,
        data: defaultSettings,
      };
    }

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      success: false,
      error: 'Failed to fetch settings',
    };
  }
} 