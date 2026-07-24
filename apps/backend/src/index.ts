import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';

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
import apiRoutes from './routes';
import shopifyWebhookRoutes from './routes/shopify/webhook.routes';
import whatsappWebhookRoutes from './routes/whatsapp/webhook.routes';

// Initialize Express App
const app = express();

// Apply Middleware
app.use(requestIdMiddleware);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compression());
app.use(cookieParser());

// Webhooks require raw body for signature verification
app.use('/api/v1/webhooks/shopify', express.raw({ type: 'application/json' }));
app.use('/api/v1/webhooks/whatsapp', express.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));

// Standard body parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(pinoHttp({ logger }));

// Health Check Endpoints (Available IMMEDIATELY)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate Limiting on API routes
app.use('/api', defaultLimiter);

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api/v1/webhooks/shopify', shopifyWebhookRoutes);
app.use('/api/v1/webhooks/whatsapp', whatsappWebhookRoutes);

// Global Error Handler
app.use(errorHandler);

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const port = Number(process.env.PORT) || env.PORT || 3001;

// Start Listening IMMEDIATELY so Railway Healthcheck Passes
server.listen(port, '0.0.0.0', () => {
  logger.info(`HTTP Server listening on 0.0.0.0:${port} in ${env.NODE_ENV} mode`);
  
  // Background initialization of DB & Redis connections (non-blocking for HTTP healthcheck)
  prisma.$connect()
    .then(() => logger.info('Database connected successfully'))
    .catch((err) => logger.error({ err }, 'Background DB connection warning'));

  startBullMQ()
    .then(() => logger.info('BullMQ queue initialized'))
    .catch((err) => logger.warn({ err }, 'Background BullMQ initialization warning'));
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (e) {}
    try {
      await stopBullMQ();
    } catch (e) {}
    try {
      await closeRedis();
    } catch (e) {}
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
