'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertSiteSettings } from '../services/siteSettings';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm } from '@/lib/security';
import { validateImage } from '@/lib/shared/utils/imageUploadUtils';
import { saveSiteSettingsImage, deleteSiteSettingsImage } from '@/lib/shared/utils/siteSettingsImageUpload';
import { prisma } from '@/lib/prisma';

export interface UpsertSiteSettingsState {
  success: boolean;
  message: string;
  error?: string;
}

export async function upsertSiteSettingsAction(prevState: UpsertSiteSettingsState, formData: FormData): Promise<UpsertSiteSettingsState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('settings', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Security validation and sanitization
    const requiredFields: string[] = [];
    const optionalFields = ['siteName', 'slogan', 'logoUrl', 'heroBackgroundImg', 'imageAboutSection'];
    
    const validation = validateAndSanitizePublicForm(formData, requiredFields, optionalFields);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation échouée',
        error: validation.errors.join(', ')
      };
    }

    // Handle image uploads
    let logoUrl = validation.sanitizedData.logoUrl || null;
    let heroBackgroundImg = validation.sanitizedData.heroBackgroundImg || null;
    let imageAboutSection = validation.sanitizedData.imageAboutSection || null;

    // Get existing settings to check for old images
    const existingSettings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
      select: { logoUrl: true, heroBackgroundImg: true } as any
    }) as any;

    // Handle logo upload
    const logoFile = formData.get('logo') as File;
    if (logoFile && logoFile.size > 0) {
      try {
        const validation = validateImage(logoFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const imageResult = await saveSiteSettingsImage(logoFile, 'logo');
        logoUrl = imageResult.path;

        // Clean up old logo if it exists
        if (existingSettings?.logoUrl) {
          await deleteSiteSettingsImage(existingSettings.logoUrl);
        }
      } catch (error) {
        return {
          success: false,
          message: 'Échec de l\'upload du logo',
          error: error instanceof Error ? error.message : 'Failed to upload logo'
        };
      }
    }

    // Handle hero background upload
    const heroFile = formData.get('heroBackground') as File;
    if (heroFile && heroFile.size > 0) {
      try {
        const validation = validateImage(heroFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const imageResult = await saveSiteSettingsImage(heroFile, 'hero-background');
        heroBackgroundImg = imageResult.path;

        // Clean up old hero background if it exists
        if (existingSettings?.heroBackgroundImg) {
          await deleteSiteSettingsImage(existingSettings.heroBackgroundImg);
        }
      } catch (error) {
        return {
          success: false,
          message: 'Échec de l\'upload de l\'image de fond',
          error: error instanceof Error ? error.message : 'Failed to upload hero background'
        };
      }
    }

    // Handle about image upload
    const aboutFile = formData.get('imageAboutSectionFile') as File;
    if (aboutFile && aboutFile.size > 0) {
      try {
        const validation = validateImage(aboutFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const imageResult = await saveSiteSettingsImage(aboutFile, 'about-section' as any);
        imageAboutSection = imageResult.path;

        if ((existingSettings as any)?.imageAboutSection) {
          await deleteSiteSettingsImage((existingSettings as any).imageAboutSection);
        }
      } catch (error) {
        return {
          success: false,
          message: 'Échec de l\'upload de l\'image de la section À propos',
          error: error instanceof Error ? error.message : 'Failed to upload about image'
        };
      }
    }

    // Extract and validate sanitized form data
    const siteData = {
      siteName: validation.sanitizedData.siteName || null,
      slogan: validation.sanitizedData.slogan || null,
      logoUrl,
      heroBackgroundImg,
      imageAboutSection,
    };

    const result = await upsertSiteSettings(siteData);

    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/settings');
      return {
        success: true,
        message: 'Paramètres du site mis à jour avec succès !',
      };
    } else {
      return {
        success: false,
        message: 'Échec de la mise à jour des paramètres du site',
        error: result.error || 'Erreur inconnue',
      };
    }
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Limite de taux')) {
        return {
          success: false,
          message: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
          error: 'Rate limit exceeded'
        };
      }
      
      if (error.message.includes('CSRF')) {
        return {
          success: false,
          message: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.',
          error: 'CSRF validation failed'
        };
      }
      
      if (error.message.includes('Permission')) {
        return {
          success: false,
          message: 'Accès refusé. Privilèges insuffisants.',
          error: 'Insufficient permissions'
        };
      }
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        message: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.'
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.'
      };
    }
    
    // Log error for monitoring
    await logError(error as Error, { 
      action: 'upsertSiteSettings', 
      identifier: await getClientIdentifier() 
    });
    
    return {
      success: false,
      message: 'Une erreur s\'est produite lors de la mise à jour des paramètres du site',
      error: 'Erreur interne du serveur',
    };
  }
}