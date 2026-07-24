import { logger } from '../config/logger';

export const handleAppUninstalled = async (shop: string, payload: any) => {
  try {
    logger.info(`[Webhook] Processing app/uninstalled for ${shop}`);
    
    // TODO: Find store by shopifyDomain
    // TODO: Call appropriate service
    // TODO: Trigger automations
    // TODO: Emit socket events
    
    logger.info(`[Webhook] Successfully processed app/uninstalled for ${shop}`);
  } catch (error) {
    logger.error({ error }, `[Webhook] Error processing app/uninstalled for ${shop}`);
    throw error;
  }
};
