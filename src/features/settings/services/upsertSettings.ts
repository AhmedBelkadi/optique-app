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
        // Basic Site Settings
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        
        // Contact Information
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        openingHours: data.openingHours || null,
        
        // SEO & Marketing
        googleMapsApiKey: data.googleMapsApiKey || null,
        whatsappChatLink: data.whatsappChatLink || null,
        googleMapEmbed: data.googleMapEmbed || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        productMetaTitle: data.productMetaTitle || null,
        productMetaDescription: data.productMetaDescription || null,
        categoryMetaTitle: data.categoryMetaTitle || null,
        categoryMetaDescription: data.categoryMetaDescription || null,
        ogImage: data.ogImage || null,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
        
        // Operational
        maintenanceMode: data.maintenanceMode ?? false,
        
        // Theme Settings - Core Colors
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        accentColor: data.accentColor || null,
        
        // Theme Settings - Background Colors
        backgroundColor: data.backgroundColor || null,
        mutedBackgroundColor: data.mutedBackgroundColor || null,
        cardBackgroundColor: data.cardBackgroundColor || null,
        
        // Theme Settings - Text Colors
        foregroundColor: data.foregroundColor || null,
        mutedForegroundColor: data.mutedForegroundColor || null,
        
        // Theme Settings - UI Colors
        borderColor: data.borderColor || null,
        popoverBackgroundColor: data.popoverBackgroundColor || null,
        popoverForegroundColor: data.popoverForegroundColor || null,
        
        // Theme Settings - Status Colors
        successColor: data.successColor || null,
        warningColor: data.warningColor || null,
        errorColor: data.errorColor || null,
        infoColor: data.infoColor || null,
        
        // Theme Settings - Section Specific Colors
        // Hero Section
        heroBadgeBackground: data.heroBadgeBackground || null,
        heroBadgeText: data.heroBadgeText || null,
        heroScrollIndicatorColor: data.heroScrollIndicatorColor || null,
        
        // Welcome Section
        welcomeBadgeBackground: data.welcomeBadgeBackground || null,
        welcomeBadgeText: data.welcomeBadgeText || null,
        welcomeFeatureIcon1Color: data.welcomeFeatureIcon1Color || null,
        welcomeFeatureIcon2Color: data.welcomeFeatureIcon2Color || null,
        welcomeFeatureIcon3Color: data.welcomeFeatureIcon3Color || null,
        
        // Products Section
        productsNewBadgeColor: data.productsNewBadgeColor || null,
        productsPopularBadgeColor: data.productsPopularBadgeColor || null,
        productsCategoryBadgeBackground: data.productsCategoryBadgeBackground || null,
        productsCategoryBadgeText: data.productsCategoryBadgeText || null,
        
        // Testimonials Section
        testimonialsBadgeBackground: data.testimonialsBadgeBackground || null,
        testimonialsBadgeText: data.testimonialsBadgeText || null,
        testimonialsStarColor: data.testimonialsStarColor || null,
        testimonialsVerifiedBadgeColor: data.testimonialsVerifiedBadgeColor || null,
        
        // Floating CTA
        floatingCTAGlowColor: data.floatingCTAGlowColor || null,
        floatingCTAParticlesColor: data.floatingCTAParticlesColor || null,
        
        // Gradient Overlays
        heroOverlayStartColor: data.heroOverlayStartColor || null,
        heroOverlayMiddleColor: data.heroOverlayMiddleColor || null,
        heroOverlayEndColor: data.heroOverlayEndColor || null,
        
        // Decorative Elements
        decorativeElement1Color: data.decorativeElement1Color || null,
        decorativeElement2Color: data.decorativeElement2Color || null,
        decorativeElement3Color: data.decorativeElement3Color || null,
      },
      create: {
        id: 'singleton',
        // Basic Site Settings
        siteName: data.siteName || null,
        slogan: data.slogan || null,
        logoUrl: data.logoUrl || null,
        
        // Contact Information
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        address: data.address || null,
        openingHours: data.openingHours || null,
        
        // SEO & Marketing
        googleMapsApiKey: data.googleMapsApiKey || null,
        whatsappChatLink: data.whatsappChatLink || null,
        googleMapEmbed: data.googleMapEmbed || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        productMetaTitle: data.productMetaTitle || null,
        productMetaDescription: data.productMetaDescription || null,
        categoryMetaTitle: data.categoryMetaTitle || null,
        categoryMetaDescription: data.categoryMetaDescription || null,
        ogImage: data.ogImage || null,
        googleAnalyticsId: data.googleAnalyticsId || null,
        facebookPixelId: data.facebookPixelId || null,
        
        // Operational
        maintenanceMode: data.maintenanceMode ?? false,
        
        // Theme Settings - Core Colors
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        accentColor: data.accentColor || null,
        
        // Theme Settings - Background Colors
        backgroundColor: data.backgroundColor || null,
        mutedBackgroundColor: data.mutedBackgroundColor || null,
        cardBackgroundColor: data.cardBackgroundColor || null,
        
        // Theme Settings - Text Colors
        foregroundColor: data.foregroundColor || null,
        mutedForegroundColor: data.mutedForegroundColor || null,
        
        // Theme Settings - UI Colors
        borderColor: data.borderColor || null,
        popoverBackgroundColor: data.popoverBackgroundColor || null,
        popoverForegroundColor: data.popoverForegroundColor || null,
        
        // Theme Settings - Status Colors
        successColor: data.successColor || null,
        warningColor: data.warningColor || null,
        errorColor: data.errorColor || null,
        infoColor: data.infoColor || null,
        
        // Theme Settings - Section Specific Colors
        // Hero Section
        heroBadgeBackground: data.heroBadgeBackground || null,
        heroBadgeText: data.heroBadgeText || null,
        heroScrollIndicatorColor: data.heroScrollIndicatorColor || null,
        
        // Welcome Section
        welcomeBadgeBackground: data.welcomeBadgeBackground || null,
        welcomeBadgeText: data.welcomeBadgeText || null,
        welcomeFeatureIcon1Color: data.welcomeFeatureIcon1Color || null,
        welcomeFeatureIcon2Color: data.welcomeFeatureIcon2Color || null,
        welcomeFeatureIcon3Color: data.welcomeFeatureIcon3Color || null,
        
        // Products Section
        productsNewBadgeColor: data.productsNewBadgeColor || null,
        productsPopularBadgeColor: data.productsPopularBadgeColor || null,
        productsCategoryBadgeBackground: data.productsCategoryBadgeBackground || null,
        productsCategoryBadgeText: data.productsCategoryBadgeText || null,
        
        // Testimonials Section
        testimonialsBadgeBackground: data.testimonialsBadgeBackground || null,
        testimonialsBadgeText: data.testimonialsBadgeText || null,
        testimonialsStarColor: data.testimonialsStarColor || null,
        testimonialsVerifiedBadgeColor: data.testimonialsVerifiedBadgeColor || null,
        
        // Floating CTA
        floatingCTAGlowColor: data.floatingCTAGlowColor || null,
        floatingCTAParticlesColor: data.floatingCTAParticlesColor || null,
        
        // Gradient Overlays
        heroOverlayStartColor: data.heroOverlayStartColor || null,
        heroOverlayMiddleColor: data.heroOverlayMiddleColor || null,
        heroOverlayEndColor: data.heroOverlayEndColor || null,
        
        // Decorative Elements
        decorativeElement1Color: data.decorativeElement1Color || null,
        decorativeElement2Color: data.decorativeElement2Color || null,
        decorativeElement3Color: data.decorativeElement3Color || null,
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