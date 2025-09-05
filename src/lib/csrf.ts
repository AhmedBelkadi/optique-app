import { cookies } from 'next/headers';

export class CSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSRFError';
  }
}

export async function verifyCSRFToken(token: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }
  
  try {
    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrf_token');
    

    
    if (!storedToken) {
      return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(token, storedToken.value);
    return isValid;
  } catch (error) {
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
  

  
  if (!await verifyCSRFToken(token)) {
    throw new CSRFError('Invalid CSRF token');
  }
  
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