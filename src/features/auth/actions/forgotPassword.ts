'use server';

import { authRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { requestPasswordReset } from '@/features/auth/services/passwordReset';
import { authSchema } from '@/features/auth/schema/authSchema';
import { logError } from '@/lib/errorHandling';

export interface ForgotPasswordState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    email: string;
  };
}

export async function forgotPasswordAction(prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting (stricter for password reset)
    await authRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const email = formData.get('email') as string;

    // Validate input
    const validation = authSchema.forgotPassword.safeParse({ email });
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: { email },
        success: false,
      };
    }

    // Request password reset
    const result = await requestPasswordReset(validation.data.email);
    
    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: { email },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to send password reset email',
        fieldErrors: {},
        values: { email },
        success: false,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        fieldErrors: {},
        values: { email: formData.get('email') as string },
        success: false,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: { email: formData.get('email') as string },
        success: false,
      };
    }

    // Log and handle other errors
    logError(error as Error, { action: 'forgotPassword', email: formData.get('email') });
    
    return {
      error: 'An unexpected error occurred. Please try again.',
      fieldErrors: {},
      values: { email: formData.get('email') as string },
      success: false,
    };
  }
}
