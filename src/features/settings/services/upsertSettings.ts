import { prisma } from '@/lib/prisma';
import { Settings } from '../schema/settingsSchema';

export async function upsertSettings(data: Settings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        openingHours: data.openingHours || null,
      },
      create: {
        id: 'singleton',
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        openingHours: data.openingHours || null,
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting settings:', error);
    return {
      success: false,
      error: 'Failed to save settings',
    };
  }
} 