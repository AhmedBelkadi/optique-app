'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { changePassword } from '../services/profileService';
import { profileSchema } from '../schema/profileSchema';
import { getCurrentUser } from '@/features/auth/services/session';
import { logError } from '@/lib/errorHandling';

export interface PasswordChangeState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  success?: boolean;
}

export async function changePasswordAction(
  prevState: PasswordChangeState, 
  formData: FormData
): Promise<PasswordChangeState> {
  try {
    // 🔐 AUTHENTICATION CHECK
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: 'Vous devez être connecté pour changer votre mot de passe',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting (stricter for password changes)
    await apiRateLimit(identifier); // 3 attempts per 15 minutes
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate input
    const validation = profileSchema.changePassword.safeParse(rawData);
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    const validatedData = validation.data;

    // Change password
    const result = await changePassword(currentUser.id, validatedData);

    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Erreur lors du changement de mot de passe',
        fieldErrors: result.fieldErrors,
        values: {
          currentPassword: '',
          newPassword: rawData.newPassword,
          confirmPassword: rawData.confirmPassword,
        },
      };
    }
  } catch (error) {
    logError(error as Error, {
      action: 'changePasswordAction',
      userId: 'unknown',
    });

    return {
      error: 'Une erreur inattendue s\'est produite',
      values: {
        currentPassword: '',
        newPassword: formData.get('newPassword') as string,
        confirmPassword: formData.get('confirmPassword') as string,
      },
    };
  }
}
