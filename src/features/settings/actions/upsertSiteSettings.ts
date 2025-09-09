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
      select: { logoUrl: true, heroBackgroundImg: true, imageAboutSection: true }
    });

    // Process all file uploads in parallel to avoid race conditions
    const uploadPromises: Promise<{ type: string; url: string }>[] = [];
    const filesToProcess: { file: File; type: string; field: string }[] = [];

    // Collect all files to upload
    const logoFile = formData.get('logo') as File;
    if (logoFile && logoFile.size > 0) {
      filesToProcess.push({ file: logoFile, type: 'logo', field: 'logoUrl' });
    }

    const heroFile = formData.get('heroBackground') as File;
    if (heroFile && heroFile.size > 0) {
      filesToProcess.push({ file: heroFile, type: 'hero-background', field: 'heroBackgroundImg' });
    }

    const aboutFile = formData.get('imageAboutSectionFile') as File;
    if (aboutFile && aboutFile.size > 0) {
      filesToProcess.push({ file: aboutFile, type: 'about-section', field: 'imageAboutSection' });
    }

    // Process uploads with small delays to reduce VPS file system pressure
    for (let i = 0; i < filesToProcess.length; i++) {
      const { file, type, field } = filesToProcess[i];
      
      const uploadPromise = (async () => {
        try {
          // Add small delay between uploads to reduce file system pressure on VPS
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 100 * i));
          }
          
          const validation = validateImage(file);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          const imageResult = await saveSiteSettingsImage(file, type as any);
          return { type: field, url: imageResult.path };
        } catch (error) {
          throw new Error(`Failed to upload ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      })();
      
      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete
    if (uploadPromises.length > 0) {
      try {
        const results = await Promise.all(uploadPromises);
        
        // Update URLs based on upload results
        for (const result of results) {
          switch (result.type) {
            case 'logoUrl':
              logoUrl = result.url;
              break;
            case 'heroBackgroundImg':
              heroBackgroundImg = result.url;
              break;
            case 'imageAboutSection':
              imageAboutSection = result.url;
              break;
          }
        }
      } catch (error) {
        return {
          success: false,
          message: 'Échec de l\'upload des images',
          error: error instanceof Error ? error.message : 'Failed to upload images'
        };
      }
    }

    // Clean up old images after successful uploads
    const cleanupPromises: Promise<void>[] = [];
    
    if (logoUrl && existingSettings?.logoUrl && logoUrl !== existingSettings.logoUrl) {
      cleanupPromises.push(deleteSiteSettingsImage(existingSettings.logoUrl));
    }
    
    if (heroBackgroundImg && existingSettings?.heroBackgroundImg && heroBackgroundImg !== existingSettings.heroBackgroundImg) {
      cleanupPromises.push(deleteSiteSettingsImage(existingSettings.heroBackgroundImg));
    }
    
    if (imageAboutSection && existingSettings?.imageAboutSection && imageAboutSection !== existingSettings.imageAboutSection) {
      cleanupPromises.push(deleteSiteSettingsImage(existingSettings.imageAboutSection));
    }

    // Clean up old images in background (don't wait for completion)
    if (cleanupPromises.length > 0) {
      Promise.all(cleanupPromises).catch(error => {
        console.error('Failed to cleanup old images:', error);
      });
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