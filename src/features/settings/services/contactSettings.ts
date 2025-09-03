import { prisma } from '@/lib/prisma';
import { ContactSettings } from '../schema/settingsSchema';

export async function getContactSettings(): Promise<{
  success: boolean;
  data?: ContactSettings;
  error?: string;
}> {
  try {
    // Use upsert to create or get existing settings
    const settings = await prisma.contactSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
      },
    });

    return {
      success: true,
      data: settings as any,
    };
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return {
      success: false,
      error: 'Failed to fetch contact settings',
    };
  }
}

export async function upsertContactSettings(data: ContactSettings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.contactSettings.upsert({
      where: { id: 'singleton' },
      update: {
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        city: data.city || null,
        openingHours: data.openingHours || null,
        googleMapsApiKey: data.googleMapsApiKey || null,
        whatsappChatLink: data.whatsappChatLink || null,
        googleMapEmbed: data.googleMapEmbed || null,
        googleMapLink: data.googleMapLink || null,
        instagramLink: data.instagramLink || null,
        facebookLink: data.facebookLink || null,
      } as any,
      create: {
        id: 'singleton',
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        city: data.city || null,
        openingHours: data.openingHours || null,
        googleMapsApiKey: data.googleMapsApiKey || null,
        whatsappChatLink: data.whatsappChatLink || null,
        googleMapEmbed: data.googleMapEmbed || null,
        googleMapLink: data.googleMapLink || null,
        instagramLink: data.instagramLink || null,
        facebookLink: data.facebookLink || null,
      } as any,
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting contact settings:', error);
    return {
      success: false,
      error: 'Failed to save contact settings',
    };
  }
}
