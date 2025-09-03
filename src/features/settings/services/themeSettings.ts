import { prisma } from '@/lib/prisma';
import { ThemeSettings } from '../schema/settingsSchema';

export async function getThemeSettings(): Promise<{
  success: boolean;
  data?: ThemeSettings;
  error?: string;
}> {
  try {
    const settings = await prisma.themeSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      // Create default theme settings if none exist
      const defaultSettings = await prisma.themeSettings.create({
        data: {
          id: 'singleton',
          // Default theme colors - using HSL values for shadcn/ui compatibility
          primaryColor: '222.2 47.4% 11.2%', // Dark blue
          secondaryColor: '210 40% 96%', // Light gray
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
    console.error('Error fetching theme settings:', error);
    return {
      success: false,
      error: 'Failed to fetch theme settings',
    };
  }
}

export async function upsertThemeSettings(data: ThemeSettings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.themeSettings.upsert({
      where: { id: 'singleton' },
      update: {
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
      },
      create: {
        id: 'singleton',
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting theme settings:', error);
    return {
      success: false,
      error: 'Failed to save theme settings',
    };
  }
}
