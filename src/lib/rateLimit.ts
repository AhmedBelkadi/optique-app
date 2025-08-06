import { cookies } from 'next/headers';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number,
    public remainingTime: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  }
): Promise<void> {
  const key = config.keyGenerator ? config.keyGenerator(identifier) : `rate_limit:${identifier}`;
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(rateLimitStore).forEach(k => {
    if (rateLimitStore[k].resetTime < now) {
      delete rateLimitStore[k];
    }
  });
  
  const current = rateLimitStore[key];
  
  if (!current || current.resetTime < now) {
    // First request or window expired
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return;
  }
  
  if (current.count >= config.maxRequests) {
    const remainingTime = current.resetTime - now;
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
      current.resetTime,
      remainingTime
    );
  }
  
  // Increment counter
  current.count++;
}

// Specific rate limiters for different endpoints
export const authRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    keyGenerator: (id) => `auth:${id}`,
  });

export const apiRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    keyGenerator: (id) => `api:${id}`,
  });

export const uploadRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    keyGenerator: (id) => `upload:${id}`,
  });

// Get client identifier (IP or user ID)
export async function getClientIdentifier(): Promise<string> {
  try {
    // In a real application, you'd get this from the request headers
    // For now, we'll use a simple approach
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    
    if (sessionToken) {
      return `user:${sessionToken.value}`;
    }
    
    // Fallback to a default identifier
    return 'anonymous';
  } catch {
    return 'anonymous';
  }
} 