'use server';

import { authRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { resetPassword } from '@/features/auth/services/passwordReset';
import { authSchema } from '@/features/auth/schema/authSchema';
import { logError } from '@/lib/errorHandling';

export interface ResetPasswordState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    password: string;
    confirmPassword: string;
  };
}

export async function resetPasswordAction(prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting (stricter for password reset)
    await authRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate input
    const validation = authSchema.resetPassword.safeParse({ token, password, confirmPassword });
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: { password, confirmPassword },
        success: false,
      };
    }

    // Reset password
    const result = await resetPassword(validation.data.token, validation.data.password);
    
    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: { password: '', confirmPassword: '' },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to reset password',
        fieldErrors: {},
        values: { password, confirmPassword },
        success: false,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        fieldErrors: {},
        values: { password: formData.get('password') as string, confirmPassword: formData.get('confirmPassword') as string },
        success: false,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: { password: formData.get('password') as string, confirmPassword: formData.get('confirmPassword') as string },
        success: false,
      };
    }

    // Log and handle other errors
    logError(error as Error, { action: 'resetPassword' });
    
    return {
      error: 'An unexpected error occurred. Please try again.',
      fieldErrors: {},
      values: { password: formData.get('password') as string, confirmPassword: formData.get('confirmPassword') as string },
      success: false,
    };
  }
}
