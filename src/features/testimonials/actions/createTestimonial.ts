'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createTestimonial } from '@/features/testimonials/services/createTestimonial';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { testimonialSchema, CreateTestimonialInput } from '../schema/testimonialSchema';

export async function createTestimonialAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('testimonials', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

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
    const validationResult = testimonialSchema.create.safeParse({
      name,
      message,
      rating: rating ? parseInt(rating, 10) : 5,
      source: source || 'internal',
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

    // Create the testimonial
    const result = await createTestimonial(validationResult.data);

    if (result.success && result.data) {
      // Revalidate relevant paths
      revalidatePath('/admin/testimonials');
      revalidatePath('/testimonials');
      
      return {
        success: true,
        message: 'Témoignage créé avec succès !',
        data: result.data,
        fieldErrors: {},
        values: {
          name: '',
          message: '',
          rating: '',
          source: 'internal',
          externalId: '',
          externalUrl: '',
          title: '',
          image: '',
          isActive: true,
          isVerified: false
        }
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la création du témoignage',
        fieldErrors: {},
        values: { name, message, rating, source, externalId, externalUrl, title, image, isActive, isVerified }
      };
    }
  } catch (error) {
    console.error('Error in createTestimonialAction:', error);
    
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
      error: 'Une erreur inattendue est survenue lors de la création du témoignage',
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