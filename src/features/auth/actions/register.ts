'use server';

import { authRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { registerUser } from '@/features/auth/services/registerUser';
import { authSchema } from '@/features/auth/schema/authSchema';
import { logError } from '@/lib/errorHandling';
import { RegisterState } from '@/types/api';

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await authRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate input
    const validation = authSchema.register.safeParse({ 
      name, 
      email, 
      password, 
      confirmPassword 
    });
    
    if (!validation.success) {
      return {
        error: '',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: { name, email },
        success: false,
      };
    }

    const result = await registerUser(validation.data.name, validation.data.email, validation.data.password, validation.data.confirmPassword);

    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          email: '',
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Registration failed',
        fieldErrors: result.fieldErrors || {},
        values: { name, email },
        success: false,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        error: error.message,
        fieldErrors: {},
        values: { 
          name: formData.get('name') as string, 
          email: formData.get('email') as string 
        },
        success: false,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: { 
          name: formData.get('name') as string, 
          email: formData.get('email') as string 
        },
        success: false,
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'register', 
      email: formData.get('email') 
    });
    
    return {
      error: 'An unexpected error occurred. Please try again.',
      fieldErrors: {},
      values: { 
        name: formData.get('name') as string, 
        email: formData.get('email') as string 
      },
      success: false,
    };
  }
} 