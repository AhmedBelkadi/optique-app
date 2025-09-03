import { cookies } from 'next/headers';
import { headers } from 'next/headers';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (identifier: string) => string;
  blockDuration?: number; // Duration to block after limit exceeded (in ms)
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blockedUntil?: number;
  };
}

// In-memory store for rate limiting (production-ready with proper cleanup)
const rateLimitStore: RateLimitStore = {};

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number,
    public remainingTime: number,
    public blockedUntil?: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class BlockedError extends Error {
  constructor(
    message: string,
    public blockedUntil: number,
    public remainingBlockTime: number
  ) {
    super(message);
    this.name = 'BlockedError';
  }
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    blockDuration: 5 * 60 * 1000, // 5 minutes block after limit exceeded
  }
): Promise<void> {
  const key = config.keyGenerator ? config.keyGenerator(identifier) : `rate_limit:${identifier}`;
  const now = Date.now();
  
  // Clean up expired entries (prevent memory leaks)
  Object.keys(rateLimitStore).forEach(k => {
    if (rateLimitStore[k].resetTime < now && (!rateLimitStore[k].blockedUntil || rateLimitStore[k].blockedUntil < now)) {
      delete rateLimitStore[k];
    }
  });
  
  const current = rateLimitStore[key];
  
  // Check if currently blocked
  if (current?.blockedUntil && current.blockedUntil > now) {
    const remainingBlockTime = current.blockedUntil - now;
    throw new BlockedError(
      `Compte temporairement bloqué. Réessayez dans ${Math.ceil(remainingBlockTime / 1000)} secondes.`,
      current.blockedUntil,
      remainingBlockTime
    );
  }
  
  if (!current || current.resetTime < now) {
    // First request or window expired
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return;
  }
  
  if (current.count >= config.maxRequests) {
    // Rate limit exceeded - block the client
    const blockUntil = now + (config.blockDuration || 5 * 60 * 1000);
    current.blockedUntil = blockUntil;
    
    const remainingTime = current.resetTime - now;
    throw new RateLimitError(
      `Limite de taux dépassée. Compte bloqué pour ${Math.ceil((config.blockDuration || 5 * 60 * 1000) / 1000 / 60)} minutes.`,
      current.resetTime,
      remainingTime,
      blockUntil
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
    blockDuration: 30 * 60 * 1000, // 30 minutes block after limit exceeded
  });

export const apiRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    keyGenerator: (id) => `api:${id}`,
    blockDuration: 10 * 60 * 1000, // 10 minutes block after limit exceeded
  });

export const uploadRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    keyGenerator: (id) => `upload:${id}`,
    blockDuration: 15 * 60 * 1000, // 15 minutes block after limit exceeded
  });

export const publicRateLimit = (identifier: string) =>
  rateLimit(identifier, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 public actions per 15 minutes (stricter for public forms)
    keyGenerator: (id) => `public:${id}`,
    blockDuration: 20 * 60 * 1000, // 20 minutes block after limit exceeded
  });

// Production-ready client identifier with REAL IP address extraction
export async function getClientIdentifier(): Promise<string> {
  try {
    // Get request headers for IP address extraction
    const headersList = await headers();
    
    // Check for session token first (authenticated users)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    
    if (sessionToken) {
      return `user:${sessionToken.value}`;
    }
    
    // Extract REAL IP address from various headers (production-ready)
    // Priority order: Cloudflare -> Real-IP -> X-Forwarded-For -> X-Real-IP
    const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
    const realIp = headersList.get('x-real-ip'); // Nginx proxy
    const forwardedFor = headersList.get('x-forwarded-for'); // Standard proxy header
    const xRealIp = headersList.get('x-real-ip'); // Alternative real IP header
    
    let clientIP = '';
    
    if (cfConnectingIp) {
      clientIP = cfConnectingIp.split(',')[0].trim();
    } else if (realIp) {
      clientIP = realIp.split(',')[0].trim();
    } else if (forwardedFor) {
      clientIP = forwardedFor.split(',')[0].trim();
    } else if (xRealIp) {
      clientIP = xRealIp.split(',')[0].trim();
    }
    
    // Validate IP address format
    if (clientIP && isValidIPAddress(clientIP)) {
      return `ip:${clientIP}`;
    }
    
    // Fallback: Generate a unique identifier based on user agent and timestamp
    const userAgent = headersList.get('user-agent') || 'unknown';
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute windows
    const userAgentHash = simpleHash(userAgent);
    
    return `anonymous:${userAgentHash}:${timestamp}`;
    
  } catch (error) {
    // Fallback to a secure anonymous identifier
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute windows
    const randomId = Math.random().toString(36).substring(2, 15);
    return `fallback:${timestamp}:${randomId}`;
  }
}

// Validate IP address format (IPv4 and IPv6)
function isValidIPAddress(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Simple hash function for user agent
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Additional security functions for production
export async function isIPBlocked(ip: string): Promise<boolean> {
  try {
    const key = `blocked_ip:${ip}`;
    const current = rateLimitStore[key];
    
    if (current?.blockedUntil) {
      return current.blockedUntil > Date.now();
    }
    
    return false;
  } catch {
    return false;
  }
}

export async function blockIP(ip: string, durationMs: number): Promise<void> {
  try {
    const key = `blocked_ip:${ip}`;
    const now = Date.now();
    
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + durationMs,
      blockedUntil: now + durationMs,
    };
  } catch {
    // Silently fail in case of errors
  }
}

export async function getRateLimitInfo(identifier: string): Promise<{
  count: number;
  remaining: number;
  resetTime: number;
  isBlocked: boolean;
  blockedUntil?: number;
}> {
  try {
    const key = `rate_limit:${identifier}`;
    const current = rateLimitStore[key];
    const now = Date.now();
    
    if (!current || current.resetTime < now) {
      return {
        count: 0,
        remaining: 100, // Default limit
        resetTime: now + (15 * 60 * 1000),
        isBlocked: false,
      };
    }
    
    const isBlocked = current.blockedUntil ? current.blockedUntil > now : false;
    
    return {
      count: current.count,
      remaining: Math.max(0, 100 - current.count), // Assuming default limit of 100
      resetTime: current.resetTime,
      isBlocked,
      blockedUntil: current.blockedUntil,
    };
  } catch {
    return {
      count: 0,
      remaining: 100,
      resetTime: Date.now() + (15 * 60 * 1000),
      isBlocked: false,
    };
  }
}

// Clean up function to prevent memory leaks (call this periodically in production)
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(k => {
    if (rateLimitStore[k].resetTime < now && (!rateLimitStore[k].blockedUntil || rateLimitStore[k].blockedUntil < now)) {
      delete rateLimitStore[k];
    }
  });
}

// Get statistics for monitoring
export function getRateLimitStats(): {
  totalEntries: number;
  blockedEntries: number;
  activeEntries: number;
} {
  const now = Date.now();
  let blocked = 0;
  let active = 0;
  
  Object.values(rateLimitStore).forEach(entry => {
    if (entry.blockedUntil && entry.blockedUntil > now) {
      blocked++;
    } else if (entry.resetTime > now) {
      active++;
    }
  });
  
  return {
    totalEntries: Object.keys(rateLimitStore).length,
    blockedEntries: blocked,
    activeEntries: active,
  };
} 