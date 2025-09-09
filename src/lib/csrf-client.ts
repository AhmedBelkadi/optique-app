// Client-side CSRF functions (no server-only imports)

export async function generateCSRFToken(): Promise<string> {
  try {
    // Check if browser is online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('Browser is offline');
    }

    console.log('CSRF Client: Attempting to generate CSRF token...');

    // First, try to get the token from the API to generate a new one
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include', // Include cookies
    });
    
    console.log('CSRF Client: API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('CSRF Client: API error response:', errorText);
      throw new Error(`Failed to generate CSRF token: ${response.status} ${response.statusText}`);
    }
    
    // The token is now stored in a non-httpOnly cookie, so we can read it
    const token = getCookieValue('csrf_token');
    
    console.log('CSRF Client: Token from cookies:', token ? 'Found' : 'Not found');
    console.log('CSRF Client: All cookies:', document.cookie);
    
    if (!token) {
      throw new Error('CSRF token not found in cookies after generation');
    }
    
    return token;
  } catch (error) {
    console.error('CSRF Client: Error generating CSRF token:', error);
    throw new Error('Failed to generate CSRF token');
  }
}

// Helper function to get cookie value
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side
  }
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

// Function to get current CSRF token from cookies
export function getCurrentCSRFToken(): string | null {
  return getCookieValue('csrf_token');
} 