import cors from 'cors';
import { env } from '../config/env';

const allowedOrigins = [
  env.FRONTEND_URL,
  // Add dynamic Shopify admin domains if needed or let them bypass via different route logic
  /\.myshopify\.com$/
];

export const corsMiddleware = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Shopify-Hmac-Sha256', 'X-Shopify-Shop-Domain']
});
