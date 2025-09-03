'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { aboutSectionFormSchema } from '@/features/about/schema/aboutSectionSchema';

export async function upsertAboutSectionAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('about', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Parse form data
    const rawData = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
    };

    // Validate form data (exclude id from validation)
    const { id, ...dataToValidate } = rawData;
    const validatedData = aboutSectionFormSchema.parse(dataToValidate);

    let section;
    
    if (id) {
      // Update existing section
      section = await prisma.aboutSection.update({
        where: { id },
        data: {
          title: validatedData.title,
          content: validatedData.content,
          image: validatedData.image,
        },
      });
    } else {
      // Create new section
      const maxOrder = await prisma.aboutSection.aggregate({
        _max: { order: true },
      });
      const nextOrder = (maxOrder._max.order || 0) + 1;

      section = await prisma.aboutSection.create({
        data: {
          ...validatedData,
          order: nextOrder,
        },
      });
    }

    // Get all sections to return updated list
    const allSections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' },
    });

    // Revalidate the about page
    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return {
      success: true,
      message: id ? 'About section updated successfully' : 'About section created successfully',
      data: allSections,
    };
  } catch (error) {
    console.error('Error in upsertAboutSectionAction:', error);
    
    if (error instanceof Error) {
      // Handle CSRF errors
      if (error.name === 'CSRFError') {
        return {
          success: false,
          error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
          fieldErrors: {}
        };
      }

      // Handle permission/authorization errors
      if (error.message.includes('NEXT_REDIRECT')) {
        // This is a redirect error, likely due to permission issues
        return {
          success: false,
          error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
          fieldErrors: {}
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}