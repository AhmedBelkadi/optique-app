'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { contactFormSchema, type ContactFormData, type ContactFormState } from '../schema/contactFormSchema';
import { sendContactMessageEmail } from '@/lib/shared/services/emailService';
import { logError } from '@/lib/errorHandling';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { sanitizeString } from '@/lib/shared/utils/sanitize';

export async function submitContactFormAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting (stricter for contact forms to prevent spam)
    await rateLimit(identifier, { maxRequests: 3, windowMs: 15 * 60 * 1000 }); // 3 attempts per 15 minutes
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Parse and sanitize form data
    const rawData = {
      name: sanitizeString(formData.get('name') as string),
      phone: sanitizeString(formData.get('phone') as string),
      email: sanitizeString(formData.get('email') as string),
      message: sanitizeString(formData.get('message') as string),
    };

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });

      return {
        success: false,
        error: 'Veuillez corriger les erreurs dans le formulaire',
        fieldErrors,
        values: rawData,
      };
    }

    const validatedData = validationResult.data;

    // Send email using existing email service
    const emailResult = await sendContactMessageEmail({
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || undefined,
      message: validatedData.message,
    });

    if (!emailResult.success) {
      logError(new Error(emailResult.error), {
        action: 'submitContactForm',
        step: 'emailSending',
        formData: validatedData,
      });

      return {
        success: false,
        error: 'Le message n\'a pas pu être envoyé. Veuillez réessayer plus tard.',
        fieldErrors: {},
        values: validatedData,
      };
    }

    // Success - revalidate the contact page
    revalidatePath('/contact');

    return {
      success: true,
      error: '',
      fieldErrors: {},
      values: {
        name: '',
        phone: '',
        email: '',
        message: '',
      },
    };

  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          phone: formData.get('phone') as string,
          email: formData.get('email') as string,
          message: formData.get('message') as string,
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          phone: formData.get('phone') as string,
          email: formData.get('email') as string,
          message: formData.get('message') as string,
        },
      };
    }

    // Log unexpected errors
    logError(error as Error, {
      action: 'submitContactForm',
      step: 'formSubmission',
      formData: {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
      }
    });

    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
      },
    };
  }
}
