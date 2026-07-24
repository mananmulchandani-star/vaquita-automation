import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file if it exists
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/vaquita'),
  SHOPIFY_API_KEY: z.string().default('dummy_shopify_key'),
  SHOPIFY_API_SECRET: z.string().default('dummy_shopify_secret'),
  SHOPIFY_SCOPES: z.string().default('read_orders,write_orders,read_customers,write_customers,read_products,read_fulfillments,write_fulfillments'),
  SHOPIFY_HOST_NAME: z.string().default('myshopify.com'),
  SHOPIFY_API_VERSION: z.string().default('2025-07'),
  APP_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default('vaquita-media').optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('fallback_jwt_secret_vaquita_automation_2026'),
  JWT_REFRESH_SECRET: z.string().default('fallback_jwt_refresh_secret_vaquita_automation_2026'),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  ENCRYPTION_KEY: z.string().default('12345678901234567890123456789012'),
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
    // Fall back to default parsing rather than exiting process
    env = envSchema.parse({});
  } else {
    throw error;
  }
}

export { env };
