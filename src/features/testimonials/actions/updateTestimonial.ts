'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateTestimonial } from '@/features/testimonials/services/updateTestimonial';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { testimonialSchema, UpdateTestimonialInput } from '../schema/testimonialSchema';

export async function updateTestimonialAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('testimonials', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const testimonialId = formData.get('id') as string;
    
    if (!testimonialId) {
      return {
        success: false,
        error: 'ID du témoignage manquant',
        fieldErrors: {}
      };
    }

    // Extract form data
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const rating = formData.get('rating') as string;
    const source = formData.get('source') as string;
    const externalId = formData.get('externalId') as string;
    const externalUrl = formData.get('externalUrl') as string;
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;
    const isActive = formData.get('isActive') === 'true';
    const isVerified = formData.get('isVerified') === 'true';

    // Validate input data using Zod schema
    const validationResult = testimonialSchema.update.safeParse({
      name,
      message,
      rating: rating ? parseInt(rating, 10) : undefined,
      source: source || undefined,
      externalId: externalId || undefined,
      externalUrl: externalUrl || undefined,
      title: title || undefined,
      image: image || undefined,
      isActive,
      isVerified,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données invalides',
        fieldErrors: validationResult.error.flatten().fieldErrors,
        values: { name, message, rating, source, externalId, externalUrl, title, image, isActive, isVerified }
      };
    }

    // Update the testimonial
    const result = await updateTestimonial(testimonialId, validationResult.data);

    if (result.success && result.data) {
      // Revalidate relevant paths
      revalidatePath('/admin/testimonials');
      revalidatePath('/testimonials');
      
      return {
        success: true,
        message: 'Témoignage mis à jour avec succès !',
        data: result.data,
        fieldErrors: {},
        values: { name, message, rating, source, externalId, externalUrl, title, image, isActive, isVerified }
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la mise à jour du témoignage',
        fieldErrors: {},
        values: { name, message, rating, source, externalId, externalUrl, title, image, isActive, isVerified }
      };
    }
  } catch (error) {
    console.error('Error in updateTestimonialAction:', error);
    
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          message: formData.get('message') as string,
          rating: formData.get('rating') as string,
          source: formData.get('source') as string,
          externalId: formData.get('externalId') as string,
          externalUrl: formData.get('externalUrl') as string,
          title: formData.get('title') as string,
          image: formData.get('image') as string,
          isActive: formData.get('isActive') === 'true',
          isVerified: formData.get('isVerified') === 'true'
        }
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          message: formData.get('message') as string,
          rating: formData.get('rating') as string,
          source: formData.get('source') as string,
          externalId: formData.get('externalId') as string,
          externalUrl: formData.get('externalUrl') as string,
          title: formData.get('title') as string,
          image: formData.get('image') as string,
          isActive: formData.get('isActive') === 'true',
          isVerified: formData.get('isVerified') === 'true'
        }
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          message: formData.get('message') as string,
          rating: formData.get('rating') as string,
          source: formData.get('source') as string,
          externalId: formData.get('externalId') as string,
          externalUrl: formData.get('externalUrl') as string,
          title: formData.get('title') as string,
          image: formData.get('image') as string,
          isActive: formData.get('isActive') === 'true',
          isVerified: formData.get('isVerified') === 'true'
        }
      };
    }
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la mise à jour du témoignage',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        message: formData.get('message') as string,
        rating: formData.get('rating') as string,
        source: formData.get('source') as string,
        externalId: formData.get('externalId') as string,
        externalUrl: formData.get('externalUrl') as string,
        title: formData.get('title') as string,
        image: formData.get('image') as string,
        isActive: formData.get('isActive') === 'true',
        isVerified: formData.get('isVerified') === 'true'
      }
    };
  }
} 