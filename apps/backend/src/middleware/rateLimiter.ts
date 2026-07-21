import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { RateLimitError } from '../lib/errors';

export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new RateLimitError(`Too many requests, please try again after ${windowMs / 1000} seconds`));
    },
    keyGenerator: (req) => {
      // Use client IP or user ID if authenticated
      return String(req.user?.userId || req.ip || req.id || 'unknown');
    }
  });
};

export const defaultLimiter = createRateLimiter(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_MAX);
export const authLimiter = createRateLimiter(60 * 1000, 10); // 10 req / minute
export const webhookLimiter = createRateLimiter(60 * 1000, 500); // 500 req / minute
export const apiLimiter = createRateLimiter(60 * 1000, 200); // 200 req / minute
