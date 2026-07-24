import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if it exists
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SHOPIFY_API_KEY: z.string(),
  SHOPIFY_API_SECRET: z.string(),
  SHOPIFY_SCOPES: z.string(),
  SHOPIFY_HOST_NAME: z.string(),
  SHOPIFY_API_VERSION: z.string().default('2025-07'),
  APP_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default('vaquita-media').optional(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  ENCRYPTION_KEY: z.string(),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100)
});

type EnvVariables = z.infer<typeof envSchema>;

let env: EnvVariables;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };
