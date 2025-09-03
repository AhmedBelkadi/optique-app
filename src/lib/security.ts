import { sanitizeString } from '@/lib/shared/utils/sanitize';

/**
 * Practical security utilities for production use
 */

export interface SecurityValidationResult {
  isValid: boolean;
  sanitizedData: Record<string, string>;
  errors: string[];
}

/**
 * Validate and sanitize public form data
 */
export function validateAndSanitizePublicForm(
  formData: FormData,
  requiredFields: string[],
  optionalFields: string[] = []
): SecurityValidationResult {
  const errors: string[] = [];
  const sanitizedData: Record<string, string> = {};

  // Validate required fields
  for (const field of requiredFields) {
    const value = formData.get(field);
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      errors.push(`Le champ ${field} est requis`);
    } else {
      sanitizedData[field] = sanitizeString(value.trim());
    }
  }

  // Sanitize optional fields
  for (const field of optionalFields) {
    const value = formData.get(field);
    if (value && typeof value === 'string') {
      sanitizedData[field] = sanitizeString(value.trim());
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedData,
    errors
  };
}

/**
 * Check for potential SQL injection patterns
 */
export function containsSQLInjectionPatterns(input: string): boolean {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(\b(or|and)\b\s+\d+\s*[=<>])/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(xp_|sp_|fn_)\b)/i
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for potential XSS patterns
 */
export function containsXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input validation for public forms
 */
export function validatePublicInput(input: string, fieldName: string): { isValid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: `Le champ ${fieldName} est requis` };
  }

  if (input.trim().length === 0) {
    return { isValid: false, error: `Le champ ${fieldName} ne peut pas être vide` };
  }

  if (containsSQLInjectionPatterns(input)) {
    return { isValid: false, error: `Le champ ${fieldName} contient des caractères non autorisés` };
  }

  if (containsXSSPatterns(input)) {
    return { isValid: false, error: `Le champ ${fieldName} contient des caractères non autorisés` };
  }

  return { isValid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Check if string contains only safe characters
 */
export function containsOnlySafeCharacters(input: string): boolean {
  const safeRegex = /^[a-zA-Z0-9\s\-_.,!?@#$%&*()+=:;'"<>\/\\[\]{}|~`]+$/;
  return safeRegex.test(input);
}

/**
 * Rate limit helper for public forms
 */
export function shouldRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const key = `security:${identifier}`;
  const now = Date.now();
  
  // Simple in-memory tracking for security attempts
  const attempts = (globalThis as any)[key] || { count: 0, resetTime: now + windowMs };
  
  if (now > attempts.resetTime) {
    attempts.count = 1;
    attempts.resetTime = now + windowMs;
  } else {
    attempts.count++;
  }
  
  (globalThis as any)[key] = attempts;
  
  return attempts.count > maxAttempts;
}
