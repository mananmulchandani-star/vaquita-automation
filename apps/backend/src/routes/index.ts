import { Router } from 'express';
import healthRoutes from './health.routes';
import shopifyAuthRoutes from './shopify/auth.routes';
import shopifyWebhookRoutes from './shopify/webhook.routes';
import whatsappWebhookRoutes from './whatsapp/webhook.routes';
import dashboardRoutes from './dashboard.routes';
import ordersRoutes from './orders.routes';
import customersRoutes from './customers.routes';
import campaignsRoutes from './campaigns.routes';
import automationsRoutes from './automations.routes';
import templatesRoutes from './templates.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/shopify/auth', shopifyAuthRoutes);
// Webhooks are mounted directly in index.ts to preserve raw body parsing
router.use('/dashboard', dashboardRoutes);
router.use('/orders', ordersRoutes);
router.use('/customers', customersRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/automations', automationsRoutes);
router.use('/templates', templatesRoutes);

export default router;
