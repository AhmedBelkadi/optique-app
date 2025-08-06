// Client-side CSRF functions (no server-only imports)

export async function generateCSRFToken(): Promise<string> {
  try {
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include', // Include cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate CSRF token');
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    throw new Error('Failed to generate CSRF token');
  }
} 