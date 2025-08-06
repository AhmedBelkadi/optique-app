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
    return timingSafeEqual(token, storedToken.value);
  } catch {
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
  const token = formData.get('csrf_token') as string;
  
  if (!await verifyCSRFToken(token)) {
    throw new CSRFError('Invalid CSRF token');
  }
} 