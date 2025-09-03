import { prisma } from '@/lib/prisma';
import { SiteSettings } from '../schema/settingsSchema';

export async function getSiteSettings(): Promise<{
  success: boolean;
  data?: SiteSettings;
  error?: string;
}> {
  try {
    // Use upsert to create or get existing settings
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
        siteName: 'Optique',
        slogan: 'Your Vision, Our Expertise',
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      success: false,
      error: 'Failed to fetch site settings',
    };
  }
}

export async function upsertSiteSettings(data: SiteSettings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        heroBackgroundImg: data.heroBackgroundImg || null,
      },
      create: {
        id: 'singleton',
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        heroBackgroundImg: data.heroBackgroundImg || null,
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting site settings:', error);
    return {
      success: false,
      error: 'Failed to save site settings',
    };
  }
}
