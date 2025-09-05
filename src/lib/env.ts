import { z } from "zod";

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  APP_NAME: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
  FACEBOOK_ACCESS_TOKEN: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),
});

// Secrets: optional at parse time
const runtimeOnlySchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  ENCRYPTION_KEY: z.string().min(32).optional(),
});

export const env = {
  ...baseSchema.parse(process.env),
  ...runtimeOnlySchema.parse(process.env),
};

export type Env = typeof env;

/**
 * 🚨 Validate required secrets only when the app boots,
 * not during `next build`
 */
export function validateRuntimeEnv() {
  if (env.NODE_ENV === "production") {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set in production");
    }
    if (!env.ENCRYPTION_KEY || env.ENCRYPTION_KEY.length < 32) {
      throw new Error("ENCRYPTION_KEY must be set and at least 32 chars in production");
    }
  }
}
