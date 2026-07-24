console.log('=== VAQUITA BACKEND STARTING (WITH PRISMA MIGRATION FIX) ===');
import express from 'express';
import http from 'http';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { exec } from 'child_process';

import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';
import { requestIdMiddleware } from './middleware/requestId';
import { corsMiddleware } from './middleware/cors';
import { helmetMiddleware } from './middleware/helmet';
import { defaultLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { initSocket } from './lib/socket';
import { startBullMQ, stopBullMQ } from './lib/queue';
import { closeRedis } from './lib/redis';
import apiRoutes from './routes/index';
import shopifyWebhookRoutes from './routes/shopify/webhook.routes';
import whatsappWebhookRoutes from './routes/whatsapp/webhook.routes';

// Initialize Express App
const app = express();

// 1. FASTEST HEALTHCHECK ENDPOINT - Placed BEFORE any middleware overhead
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/v1/health', (_req, res) => {
  res.status(200).send('OK');
});

// Apply Standard Middleware
app.use(requestIdMiddleware);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compression());
app.use(cookieParser());

// Webhooks require raw body for signature verification (do this BEFORE global JSON parser)
app.use('/api/v1/shopify/webhooks', express.raw({ type: 'application/json' }), shopifyWebhookRoutes);
app.use('/api/v1/whatsapp/webhooks', express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf; } }), whatsappWebhookRoutes);

// Standard body parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(pinoHttp({ logger }));

// Rate Limiting on API routes
app.use('/api', defaultLimiter);

// API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const port = Number(process.env.PORT) || env.PORT || 3001;

// 2. Start Listening IMMEDIATELY on 0.0.0.0 so Railway Healthcheck succeeds in Attempt #1 (< 1s)
server.listen(port, '0.0.0.0', () => {
  logger.info(`🚀 HTTP Server listening on 0.0.0.0:${port} in ${env.NODE_ENV} mode`);

  // 3. Connect Prisma
  prisma.$connect()
    .then(() => logger.info('Database connected successfully'))
    .catch((e) => logger.error({ err: e.message }, 'Background DB connection warning'));

  // 4. Asynchronous BullMQ background init
  startBullMQ()
    .then(() => logger.info('BullMQ queue initialized'))
    .catch((e) => logger.warn({ err: e.message }, 'Background BullMQ initialization warning'));
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    try { await prisma.$disconnect(); } catch (e) {}
    try { await stopBullMQ(); } catch (e) {}
    try { await closeRedis(); } catch (e) {}
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
