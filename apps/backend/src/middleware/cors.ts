import cors from 'cors';
import { env } from '../config/env';

const allowedOrigins = [
  env.FRONTEND_URL,
  // Add dynamic Shopify admin domains if needed or let them bypass via different route logic
  /\.myshopify\.com$/
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Check if exact match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check regex matches
    const isMatched = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isMatched) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Shopify-Hmac-Sha256', 'X-Shopify-Shop-Domain']
});
