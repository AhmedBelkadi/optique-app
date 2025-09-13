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

    // Process uploads with robust error handling and retry logic
    for (let i = 0; i < filesToProcess.length; i++) {
      const { file, type, field } = filesToProcess[i];
      
      const uploadPromise = (async () => {
        const maxRetries = 3;
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            // Add small delay between uploads to reduce file system pressure on VPS
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 100 * i));
            }
            
            console.log(`[Site Settings Action] Processing ${type} file (attempt ${attempt}/${maxRetries}): ${file.name} (${file.size} bytes)`);
            
            // Check file size before processing
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxFileSize) {
              throw new Error(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
            }
            
            const imageResult = await saveSiteSettingsImage(file, type as any);
            console.log(`[Site Settings Action] Successfully processed ${type}: ${imageResult.path}`);
            return { type: field, url: imageResult.path };
            
          } catch (error) {
            lastError = error as Error;
            console.error(`[Site Settings Action] Attempt ${attempt} failed for ${type}:`, error);
            
            // Don't retry for certain types of errors
            if (error instanceof Error) {
              if (error.message.includes('too large') || 
                  error.message.includes('invalid format') ||
                  error.message.includes('validation failed')) {
                throw error; // Don't retry validation errors
              }
            }
            
            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
              const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
              console.log(`[Site Settings Action] Retrying ${type} in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        
        // If we get here, all retries failed
        throw new Error(`Failed to upload ${type} after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
      })();
      
      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete with better error handling
    if (uploadPromises.length > 0) {
      try {
        console.log(`[Site Settings Action] Waiting for ${uploadPromises.length} uploads to complete...`);
        
        // Use Promise.allSettled to handle partial failures gracefully
        const results = await Promise.allSettled(uploadPromises);
        console.log(`[Site Settings Action] Upload results:`, results);
        
        const successfulUploads: { type: string; url: string }[] = [];
        const failedUploads: string[] = [];
        
        // Process results
        results.forEach((result, index) => {
          const { type } = filesToProcess[index];
          
          if (result.status === 'fulfilled') {
            successfulUploads.push(result.value);
            console.log(`[Site Settings Action] ✅ ${type} uploaded successfully: ${result.value.url}`);
          } else {
            failedUploads.push(`${type}: ${result.reason?.message || 'Unknown error'}`);
            console.error(`[Site Settings Action] ❌ ${type} upload failed:`, result.reason);
          }
        });
        
        // If all uploads failed, try fallback strategy (sequential uploads)
        if (successfulUploads.length === 0 && failedUploads.length > 0) {
          console.log('[Site Settings Action] All parallel uploads failed, trying sequential fallback...');
          
          const fallbackResults: { type: string; url: string }[] = [];
          const fallbackErrors: string[] = [];
          
          // Try uploading files one by one
          for (const { file, type, field } of filesToProcess) {
            try {
              console.log(`[Site Settings Action] Fallback upload for ${type}...`);
              const imageResult = await saveSiteSettingsImage(file, type as any);
              fallbackResults.push({ type: field, url: imageResult.path });
              console.log(`[Site Settings Action] Fallback success for ${type}: ${imageResult.path}`);
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Unknown error';
              fallbackErrors.push(`${type}: ${errorMsg}`);
              console.error(`[Site Settings Action] Fallback failed for ${type}:`, error);
            }
          }
          
          // If fallback also failed completely, return error
          if (fallbackResults.length === 0) {
            return {
              success: false,
              message: 'Impossible de télécharger les images. Veuillez vérifier la taille et le format de vos fichiers.',
              error: `Erreurs: ${fallbackErrors.join(', ')}`
            };
          }
          
          // Use fallback results
          successfulUploads.push(...fallbackResults);
          if (fallbackErrors.length > 0) {
            failedUploads.push(...fallbackErrors);
          }
        }
        
        // If some uploads failed, warn but continue
        if (failedUploads.length > 0) {
          console.warn(`[Site Settings Action] ⚠️ Some uploads failed: ${failedUploads.join(', ')}`);
        }
        
        // Update URLs based on successful upload results
        for (const result of successfulUploads) {
          switch (result.type) {
            case 'logoUrl':
              logoUrl = result.url;
              console.log(`[Site Settings Action] Updated logoUrl: ${logoUrl}`);
              break;
            case 'heroBackgroundImg':
              heroBackgroundImg = result.url;
              console.log(`[Site Settings Action] Updated heroBackgroundImg: ${heroBackgroundImg}`);
              break;
            case 'imageAboutSection':
              imageAboutSection = result.url;
              console.log(`[Site Settings Action] Updated imageAboutSection: ${imageAboutSection}`);
              break;
          }
        }
        
      } catch (error) {
        console.error(`[Site Settings Action] Critical upload error:`, error);
        return {
          success: false,
          message: 'Erreur critique lors du téléchargement des images',
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
    // Handle specific error types with detailed user feedback
    if (error instanceof Error) {
      console.error(`[Site Settings Action] Error caught: ${error.message}`, error);
      
      // Rate limiting errors
      if (error.message.includes('Limite de taux') || error.message.includes('rate limit')) {
        return {
          success: false,
          message: 'Trop de tentatives. Veuillez patienter 1 minute avant de réessayer.',
          error: 'Rate limit exceeded'
        };
      }
      
      // CSRF errors
      if (error.message.includes('CSRF') || error.message.includes('csrf')) {
        return {
          success: false,
          message: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.',
          error: 'CSRF validation failed'
        };
      }
      
      // Permission errors
      if (error.message.includes('Permission') || error.message.includes('permission')) {
        return {
          success: false,
          message: 'Accès refusé. Privilèges insuffisants.',
          error: 'Insufficient permissions'
        };
      }
      
      // File size errors
      if (error.message.includes('too large') || error.message.includes('Request Entity Too Large')) {
        return {
          success: false,
          message: 'Fichier trop volumineux. Veuillez réduire la taille de vos images (max 5MB par fichier).',
          error: 'File too large'
        };
      }
      
      // File format errors
      if (error.message.includes('invalid format') || error.message.includes('unsupported format')) {
        return {
          success: false,
          message: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.',
          error: 'Invalid file format'
        };
      }
      
      // Database errors
      if (error.message.includes('database') || error.message.includes('prisma') || error.message.includes('connection')) {
        return {
          success: false,
          message: 'Erreur de base de données. Veuillez réessayer dans quelques instants.',
          error: 'Database error'
        };
      }
      
      // File system errors
      if (error.message.includes('ENOSPC') || error.message.includes('disk space')) {
        return {
          success: false,
          message: 'Espace disque insuffisant sur le serveur. Contactez l\'administrateur.',
          error: 'Insufficient disk space'
        };
      }
      
      if (error.message.includes('EACCES') || error.message.includes('permission denied')) {
        return {
          success: false,
          message: 'Erreur de permissions de fichier. Contactez l\'administrateur.',
          error: 'File permission error'
        };
      }
      
      // Network/timeout errors
      if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        return {
          success: false,
          message: 'Délai d\'attente dépassé. Veuillez réessayer avec des fichiers plus petits.',
          error: 'Request timeout'
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