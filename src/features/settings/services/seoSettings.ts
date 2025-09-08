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
        homepage: {
          title: null,
          description: null,
          keywords: null,
        },
        about: {
          title: null,
          description: null,
          keywords: null,
        },
        contact: {
          title: null,
          description: null,
          keywords: null,
        },
        appointment: {
          title: null,
          description: null,
          keywords: null,
        },
        faq: {
          title: null,
          description: null,
          keywords: null,
        },
        testimonials: {
          title: null,
          description: null,
          keywords: null,
        },
        products: {
          titleTemplate: null,
          descriptionTemplate: null,
          keywords: null,
        },
        productDetails: {
          titleTemplate: null,
          descriptionTemplate: null,
          keywords: null,
        },
      },
    });

    return {
      success: true,
      data: settings as SEOSettings,
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
        ogImage: data.ogImage || null,
        homepage: data.homepage || null,
        about: data.about || null,
        contact: data.contact || null,
        appointment: data.appointment || null,
        faq: data.faq || null,
        testimonials: data.testimonials || null,
        products: data.products || null,
        productDetails: data.productDetails || null,
        canonicalBaseUrl: data.canonicalBaseUrl || null,
        robotsIndex: data.robotsIndex ?? true,
        robotsFollow: data.robotsFollow ?? true,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
        googleSearchConsole: data.googleSearchConsole || null,
      },
      create: {
        id: 'singleton',
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        ogImage: data.ogImage || null,
        homepage: data.homepage || null,
        about: data.about || null,
        contact: data.contact || null,
        appointment: data.appointment || null,
        faq: data.faq || null,
        testimonials: data.testimonials || null,
        products: data.products || null,
        productDetails: data.productDetails || null,
        canonicalBaseUrl: data.canonicalBaseUrl || null,
        robotsIndex: data.robotsIndex ?? true,
        robotsFollow: data.robotsFollow ?? true,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
        googleSearchConsole: data.googleSearchConsole || null,
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