'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertSEOSettings } from '../services/seoSettings';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm } from '@/lib/security';
import { validateImage } from '@/lib/shared/utils/imageUploadUtils';
import { saveSiteSettingsImage, deleteSiteSettingsImage } from '@/lib/shared/utils/siteSettingsImageUpload';
import { prisma } from '@/lib/prisma';

export interface UpsertSEOSettingsState {
  success: boolean;
  message: string;
  error?: string;
}

export async function upsertSEOSettingsAction(prevState: UpsertSEOSettingsState, formData: FormData): Promise<UpsertSEOSettingsState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('seo', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Security validation and sanitization
    const requiredFields: string[] = [];
    const optionalFields = [
      'metaTitle', 'metaDescription', 'ogImage',
      'homepage', 'about', 'contact', 'appointment', 'faq', 'testimonials',
      'products', 'productDetails',
      'canonicalBaseUrl', 'robotsIndex', 'robotsFollow',
      'googleAnalyticsId', 'facebookPixelId', 'googleSearchConsole'
    ];
    
    const validation = validateAndSanitizePublicForm(formData, requiredFields, optionalFields);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation échouée',
        error: validation.errors.join(', ')
      };
    }

    // Handle OG image upload
    let ogImageUrl = validation.sanitizedData.ogImage || null;

    // Get existing settings to check for old images
    const existingSettings = await prisma.sEOSettings.findUnique({
      where: { id: 'singleton' },
      select: { ogImage: true }
    });

    // Handle OG image upload
    const ogImageFile = formData.get('ogImage') as File;
    if (ogImageFile && ogImageFile.size > 0) {
      try {
        const imageValidation = validateImage(ogImageFile);
        if (!imageValidation.isValid) {
          throw new Error(imageValidation.error);
        }

        const imageResult = await saveSiteSettingsImage(ogImageFile, 'og-image');
        ogImageUrl = imageResult.path;

        // Clean up old OG image if it exists
        if (existingSettings?.ogImage) {
          await deleteSiteSettingsImage(existingSettings.ogImage);
        }
      } catch (error) {
        return {
          success: false,
          message: 'Échec de l\'upload de l\'image OG',
          error: error instanceof Error ? error.message : 'Failed to upload OG image'
        };
      }
    }

    // Parse JSON fields
    const parseJsonField = (field: string) => {
      try {
        const value = validation.sanitizedData[field];
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };

    // Extract and validate sanitized form data
    const seoData = {
      metaTitle: validation.sanitizedData.metaTitle || null,
      metaDescription: validation.sanitizedData.metaDescription || null,
      ogImage: ogImageUrl,
      homepage: parseJsonField('homepage'),
      about: parseJsonField('about'),
      contact: parseJsonField('contact'),
      appointment: parseJsonField('appointment'),
      faq: parseJsonField('faq'),
      testimonials: parseJsonField('testimonials'),
      products: parseJsonField('products'),
      productDetails: parseJsonField('productDetails'),
      canonicalBaseUrl: validation.sanitizedData.canonicalBaseUrl || null,
      robotsIndex: validation.sanitizedData.robotsIndex === 'true',
      robotsFollow: validation.sanitizedData.robotsFollow === 'true',
      googleAnalyticsId: validation.sanitizedData.googleAnalyticsId || null,
      facebookPixelId: validation.sanitizedData.facebookPixelId || null,
      googleSearchConsole: validation.sanitizedData.googleSearchConsole || null,
    };

    const result = await upsertSEOSettings(seoData);

    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/content/seo');
      return {
        success: true,
        message: 'Paramètres SEO mis à jour avec succès'
      };
    } else {
      return {
        success: false,
        message: 'Échec de la mise à jour des paramètres SEO',
        error: result.error
      };
    }
  } catch (error) {
    logError('upsertSEOSettingsAction', error as Error, {
      formData: Object.fromEntries(formData.entries())
    });
    
    return {
      success: false,
      message: 'Erreur interne du serveur',
      error: 'Une erreur inattendue s\'est produite'
    };
  }
}