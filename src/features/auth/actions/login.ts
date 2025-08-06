'use server';

import { authRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { loginUser } from '@/features/auth/services/loginUser';
import { authSchema } from '@/features/auth/schema/authSchema';
import { logError } from '@/lib/errorHandling';
import { LoginState } from '@/types/api';

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await authRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate input
    const validation = authSchema.login.safeParse({ email, password });
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: { email },
        success: false,
      };
    }

    // Attempt login
    const result = await loginUser(validation.data.email, validation.data.password);
    
    if (result.success && result.user) {
      return {
        error: '',
        fieldErrors: {},
        values: { email },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Invalid email or password',
        fieldErrors: result.fieldErrors || {},
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
    logError(error as Error, { action: 'login', email: formData.get('email') });
    
    return {
      error: 'An unexpected error occurred. Please try again.',
      fieldErrors: {},
      values: { email: formData.get('email') as string },
      success: false,
    };
  }
} 