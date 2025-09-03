'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';

export async function logoutAction(prevState: any, formData: FormData) {
  try {
    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting (stricter for logout to prevent abuse)
    await rateLimit(identifier, { maxRequests: 5, windowMs: 15 * 60 * 1000 }); // 5 attempts per 15 minutes
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Clear session cookies
    const cookieStore = await cookies();
    
    // Remove session-related cookies
    cookieStore.delete('session_token');
    cookieStore.delete('user_data');
    cookieStore.delete('csrf_token');
    
    // Redirect to login page
    redirect('/auth/login');
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      logError(error, { action: 'logout', error: 'rate_limit_exceeded' });
      redirect('/auth/login?error=rate_limit');
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      logError(error, { action: 'logout', error: 'csrf_validation_failed' });
      redirect('/auth/login?error=security');
    }

    // Log and handle other errors
    logError(error as Error, { action: 'logout' });
    
    // Even if there's an error, redirect to login
    redirect('/auth/login');
  }
} 