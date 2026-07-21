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
import { startBullMQ } from './lib/queue';
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

// Rate Limiting
app.use('/api', defaultLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/v1', apiRoutes);
app.use('/api/v1/webhooks/shopify', shopifyWebhookRoutes);
app.use('/api/v1/webhooks/whatsapp', whatsappWebhookRoutes);
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global Error Handler
app.use(errorHandler);

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start Server
const startServer = async () => {
  try {
    // Verify DB connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start BullMQ / Redis connection
    await startBullMQ();

    server.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('Database connection closed');
    // Close socket io, queue connections, etc.
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
