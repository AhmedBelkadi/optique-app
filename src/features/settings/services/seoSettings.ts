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
        metaTitle: null,
        metaDescription: null,
        ogImage: null,
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
        canonicalBaseUrl: null,
        robotsIndex: true,
        robotsFollow: true,
        googleAnalyticsId: null,
        facebookPixelId: null,
        googleSearchConsole: null,
      },
    });

    // Parse JSON fields
    const parsedSettings = {
      ...settings,
      homepage: settings.homepage ? JSON.parse(settings.homepage as string) : null,
      about: settings.about ? JSON.parse(settings.about as string) : null,
      contact: settings.contact ? JSON.parse(settings.contact as string) : null,
      appointment: settings.appointment ? JSON.parse(settings.appointment as string) : null,
      faq: settings.faq ? JSON.parse(settings.faq as string) : null,
      testimonials: settings.testimonials ? JSON.parse(settings.testimonials as string) : null,
      products: settings.products ? JSON.parse(settings.products as string) : null,
      productDetails: settings.productDetails ? JSON.parse(settings.productDetails as string) : null,
    };

    return {
      success: true,
      data: parsedSettings as SEOSettings,
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
        homepage: data.homepage ? JSON.stringify(data.homepage) : null,
        about: data.about ? JSON.stringify(data.about) : null,
        contact: data.contact ? JSON.stringify(data.contact) : null,
        appointment: data.appointment ? JSON.stringify(data.appointment) : null,
        faq: data.faq ? JSON.stringify(data.faq) : null,
        testimonials: data.testimonials ? JSON.stringify(data.testimonials) : null,
        products: data.products ? JSON.stringify(data.products) : null,
        productDetails: data.productDetails ? JSON.stringify(data.productDetails) : null,
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
        homepage: data.homepage ? JSON.stringify(data.homepage) : null,
        about: data.about ? JSON.stringify(data.about) : null,
        contact: data.contact ? JSON.stringify(data.contact) : null,
        appointment: data.appointment ? JSON.stringify(data.appointment) : null,
        faq: data.faq ? JSON.stringify(data.faq) : null,
        testimonials: data.testimonials ? JSON.stringify(data.testimonials) : null,
        products: data.products ? JSON.stringify(data.products) : null,
        productDetails: data.productDetails ? JSON.stringify(data.productDetails) : null,
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