import { prisma } from '@/lib/prisma';
import { OperationalSettings } from '../schema/settingsSchema';

export async function getOperationalSettings(): Promise<{
  success: boolean;
  data?: OperationalSettings;
  error?: string;
}> {
  try {
    const settings = await prisma.operationalSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      // Create default operational settings if none exist
      const defaultSettings = await prisma.operationalSettings.create({
        data: {
          id: 'singleton',
          maintenanceMode: false,
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
    console.error('Error fetching operational settings:', error);
    return {
      success: false,
      error: 'Failed to fetch operational settings',
    };
  }
}

export async function upsertOperationalSettings(data: OperationalSettings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.operationalSettings.upsert({
      where: { id: 'singleton' },
      update: {
        maintenanceMode: data.maintenanceMode ?? false,
      },
      create: {
        id: 'singleton',
        maintenanceMode: data.maintenanceMode ?? false,
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting operational settings:', error);
    return {
      success: false,
      error: 'Failed to save operational settings',
    };
  }
}
