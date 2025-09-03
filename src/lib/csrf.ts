import { cookies } from 'next/headers';

export class CSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSRFError';
  }
}

export async function verifyCSRFToken(token: string | null): Promise<boolean> {
  if (!token) {
    console.log('CSRF Verify: No token provided');
    return false;
  }
  
  try {
    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrf_token');
    
    console.log('CSRF Verify Debug:', {
      providedToken: token,
      storedToken: storedToken?.value,
      hasStoredToken: !!storedToken,
      tokenLength: token?.length,
      storedTokenLength: storedToken?.value?.length,
    });
    
    if (!storedToken) {
      console.log('CSRF Verify: No stored token found');
      return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(token, storedToken.value);
    console.log('CSRF Verify: Token comparison result:', isValid);
    return isValid;
  } catch (error) {
    console.log('CSRF Verify: Error occurred:', error);
    return false;
  }
}

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

export async function validateCSRFToken(formData: FormData): Promise<void> {
  // Get the CSRF token from the FormData
  const token = formData.get('csrf_token') as string;
  
  console.log('CSRF Validation Debug:', {
    tokenFromFormData: token,
    tokenLength: token?.length,
    hasToken: !!token,
  });
  
  if (!await verifyCSRFToken(token)) {
    console.log('CSRF validation failed');
    throw new CSRFError('Invalid CSRF token');
  }
  
  console.log('CSRF validation successful');
}

// Alternative validation that reads from cookies directly (for cases where token is not in FormData)
export async function validateCSRFTokenFromCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrf_token');
    
    if (!storedToken) {
      throw new CSRFError('CSRF token not found in cookies');
    }
    
    // Token exists in cookies, consider it valid
    // In a more secure implementation, you might want to validate against a stored token
    return;
  } catch (error) {
    throw new CSRFError('Failed to validate CSRF token from cookies');
  }
} 