'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateProfile } from '../services/profileService';
import { profileSchema } from '../schema/profileSchema';
import { getCurrentUser } from '@/features/auth/services/session';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';

export interface ProfileUpdateState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    email: string;
    phone: string;
  };
  success?: boolean;
}

export async function updateProfileAction(
  prevState: ProfileUpdateState, 
  formData: FormData
): Promise<ProfileUpdateState> {
  try {
    // 🔐 AUTHENTICATION CHECK
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: 'Vous devez être connecté pour modifier votre profil',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    // Validate input
    const validation = profileSchema.update.safeParse(rawData);
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    const validatedData = validation.data;

    // Update profile
    const result = await updateProfile(currentUser.id, validatedData);

    if (result.success) {
      // Revalidate user data
      revalidateTag('user-profile');
      
      return {
        error: '',
        fieldErrors: {},
        values: {
          ...validatedData,
          phone: validatedData.phone || ''
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Erreur lors de la mise à jour du profil',
        fieldErrors: result.fieldErrors,
        values: rawData,
      };
    }
  } catch (error) {
    logError(error as Error, {
      action: 'updateProfileAction',
      userId: 'unknown',
    });

    return {
      error: 'Une erreur inattendue s\'est produite',
      values: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      },
    };
  }
}
