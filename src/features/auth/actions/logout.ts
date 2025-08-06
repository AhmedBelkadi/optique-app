'use server';

import { destroySession } from '@/features/auth/services/session';
import { LogoutState } from '@/types/api';
import { validateCSRFToken } from '@/lib/csrf';

export async function logoutAction(_prevState: LogoutState, formData: FormData): Promise<LogoutState> {
  try {
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    await destroySession();
    return {
      success: true,
      error: '',
    };
  } catch (error) {
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Security validation failed. Please refresh the page and try again.',
      };
    }
    
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during logout',
    };
  }
} 