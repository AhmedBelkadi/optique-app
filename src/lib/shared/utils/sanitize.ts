import DOMPurify from 'isomorphic-dompurify';

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove HTML tags and dangerous content
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Basic email sanitization
  return email.toLowerCase().trim();
}

export function sanitizeNumber(value: string | number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

export function validateAndSanitizeProduct(data: {
  name: string;
  description: string;
  price: string | number;
  brand?: string;
  reference?: string;
  categoryIds: string[];
}) {
  return {
    name: sanitizeString(data.name).slice(0, 100), // Limit to 100 chars
    description: sanitizeString(data.description).slice(0, 1000), // Limit to 1000 chars
    price: sanitizeNumber(data.price),
    brand: data.brand ? sanitizeString(data.brand).slice(0, 50) : undefined,
    reference: data.reference ? sanitizeString(data.reference).slice(0, 50) : undefined,
    categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds.filter(id => typeof id === 'string') : [],
  };
}

export function validateAndSanitizeCategory(data: {
  name: string;
  description?: string;
}) {
  return {
    name: sanitizeString(data.name).slice(0, 50), // Limit to 50 chars
    description: data.description ? sanitizeString(data.description).slice(0, 200) : undefined, // Limit to 200 chars
  };
}

export function validateAndSanitize(data: any): any {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }
  
  if (typeof data === 'number') {
    return sanitizeNumber(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => validateAndSanitize(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        sanitized[key] = validateAndSanitize(value);
      }
    }
    return sanitized;
  }
  
  return data;
} 