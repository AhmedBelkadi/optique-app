import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().min(32, 'Encryption key must be at least 32 characters long'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Add optional environment variables for production
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  // Email service configuration
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  APP_NAME: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // External API integration
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
  FACEBOOK_ACCESS_TOKEN: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Validate critical environment variables at startup
if (!env.ENCRYPTION_KEY || env.ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
} 