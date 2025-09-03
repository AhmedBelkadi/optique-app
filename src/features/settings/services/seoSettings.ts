import { prisma } from '@/lib/prisma';
import { SEOSettings } from '../schema/settingsSchema';

export async function getSEOSettings(): Promise<{
  success: boolean;
  data?: SEOSettings;
  error?: string;
}> {
  try {
    // Use upsert to create or get existing settings
    const settings = await prisma.sEOSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return {
      success: false,
      error: 'Failed to fetch SEO settings',
    };
  }
}

export async function upsertSEOSettings(data: SEOSettings): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const settings = await prisma.sEOSettings.upsert({
      where: { id: 'singleton' },
      update: {
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        productMetaTitle: data.productMetaTitle || null,
        productMetaDescription: data.productMetaDescription || null,
        categoryMetaTitle: data.categoryMetaTitle || null,
        categoryMetaDescription: data.categoryMetaDescription || null,
        ogImage: data.ogImage || null,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
      },
      create: {
        id: 'singleton',
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        productMetaTitle: data.productMetaTitle || null,
        productMetaDescription: data.productMetaDescription || null,
        categoryMetaTitle: data.categoryMetaTitle || null,
        categoryMetaDescription: data.categoryMetaDescription || null,
        ogImage: data.ogImage || null,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
      },
    });

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error upserting SEO settings:', error);
    return {
      success: false,
      error: 'Failed to save SEO settings',
    };
  }
}
