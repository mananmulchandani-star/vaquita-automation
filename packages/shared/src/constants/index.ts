export const SHOPIFY_API_VERSION = '2025-07';
export const WHATSAPP_API_VERSION = 'v21.0';
export const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;
export const MAX_RETRY_ATTEMPTS = 5;
export const INITIAL_RETRY_DELAY_MS = 1000;
export const MAX_WHATSAPP_MESSAGES_PER_SECOND = 80;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SHOPIFY_API_ERROR: 'SHOPIFY_API_ERROR',
  WHATSAPP_API_ERROR: 'WHATSAPP_API_ERROR',
} as const;

export const WEBHOOK_TOPICS = [
  'orders/create',
  'orders/updated',
  'orders/cancelled',
  'orders/fulfilled',
  'orders/partially_fulfilled',
  'customers/create',
  'customers/update',
  'app/uninstalled',
] as const;

export const AUTOMATION_TEMPLATES = [
  {
    id: 'cod_confirmation',
    name: 'COD Order Confirmation',
    trigger: 'ORDER_CREATED',
    description: 'Ask for COD confirmation when an order is created.'
  },
  {
    id: 'shipping_update',
    name: 'Shipping Update Notification',
    trigger: 'FULFILLMENT_CREATED',
    description: 'Send a notification when an order is shipped.'
  }
] as const;
