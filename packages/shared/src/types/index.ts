// Enums
export enum UserRole { ADMIN = 'ADMIN', MANAGER = 'MANAGER', AGENT = 'AGENT' }
export enum OrderFinancialStatus { PENDING = 'PENDING', AUTHORIZED = 'AUTHORIZED', PARTIALLY_PAID = 'PARTIALLY_PAID', PAID = 'PAID', PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED', REFUNDED = 'REFUNDED', VOIDED = 'VOIDED' }
export enum OrderFulfillmentStatus { UNFULFILLED = 'UNFULFILLED', PARTIAL = 'PARTIAL', FULFILLED = 'FULFILLED', RESTOCKED = 'RESTOCKED' }
export enum PaymentMethod { COD = 'COD', PREPAID = 'PREPAID' }
export enum MessageDirection { INBOUND = 'INBOUND', OUTBOUND = 'OUTBOUND' }
export enum MessageType { TEXT = 'TEXT', TEMPLATE = 'TEMPLATE', IMAGE = 'IMAGE', VIDEO = 'VIDEO', DOCUMENT = 'DOCUMENT', BUTTON = 'BUTTON', LIST = 'LIST', INTERACTIVE = 'INTERACTIVE' }
export enum MessageStatus { QUEUED = 'QUEUED', SENT = 'SENT', DELIVERED = 'DELIVERED', READ = 'READ', FAILED = 'FAILED' }
export enum TemplateStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED' }
export enum TemplateCategory { MARKETING = 'MARKETING', UTILITY = 'UTILITY', AUTHENTICATION = 'AUTHENTICATION' }
export enum AutomationTrigger { ORDER_CREATED = 'ORDER_CREATED', ORDER_UPDATED = 'ORDER_UPDATED', ORDER_CANCELLED = 'ORDER_CANCELLED', FULFILLMENT_CREATED = 'FULFILLMENT_CREATED', FULFILLMENT_UPDATED = 'FULFILLMENT_UPDATED', CUSTOMER_CREATED = 'CUSTOMER_CREATED', CUSTOMER_REPLIED = 'CUSTOMER_REPLIED', SCHEDULED = 'SCHEDULED', MANUAL = 'MANUAL', ABANDONED_CART = 'ABANDONED_CART', BACK_IN_STOCK = 'BACK_IN_STOCK' }
export enum AutomationBlockType { TRIGGER = 'TRIGGER', DELAY = 'DELAY', CONDITION = 'CONDITION', FILTER = 'FILTER', ACTION = 'ACTION', BRANCH = 'BRANCH', END = 'END' }
export enum AutomationRunStatus { RUNNING = 'RUNNING', WAITING = 'WAITING', COMPLETED = 'COMPLETED', FAILED = 'FAILED', CANCELLED = 'CANCELLED' }
export enum CampaignStatus { DRAFT = 'DRAFT', SCHEDULED = 'SCHEDULED', RUNNING = 'RUNNING', PAUSED = 'PAUSED', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export enum QueueStatus { PENDING = 'PENDING', PROCESSING = 'PROCESSING', COMPLETED = 'COMPLETED', FAILED = 'FAILED', DEAD_LETTER = 'DEAD_LETTER' }
export enum QueuePriority { CRITICAL = 1, HIGH = 2, NORMAL = 3, LOW = 4 }
export enum ShippingStatus { PICKED_UP = 'PICKED_UP', IN_TRANSIT = 'IN_TRANSIT', OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', DELIVERED = 'DELIVERED', RETURNED = 'RETURNED', FAILED_DELIVERY = 'FAILED_DELIVERY' }
export enum ReturnStatus { REQUESTED = 'REQUESTED', APPROVED = 'APPROVED', PICKED_UP = 'PICKED_UP', RECEIVED = 'RECEIVED', REFUNDED = 'REFUNDED', REJECTED = 'REJECTED' }
export enum ExchangeStatus { REQUESTED = 'REQUESTED', APPROVED = 'APPROVED', SHIPPED = 'SHIPPED', COMPLETED = 'COMPLETED', REJECTED = 'REJECTED' }
export enum DiscountType { PERCENTAGE = 'PERCENTAGE', FIXED_AMOUNT = 'FIXED_AMOUNT' }
export enum CustomerOptInStatus { OPTED_IN = 'OPTED_IN', OPTED_OUT = 'OPTED_OUT', BLOCKED = 'BLOCKED' }

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Dashboard types
export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesRead: number;
  replyRate: number;
  confirmationRate: number;
  rtoSaved: number;
  codConfirmed: number;
  campaignRevenue: number;
}

export interface DashboardChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

// Automation flow types
export interface AutomationFlow {
  blocks: AutomationBlock[];
  connections: AutomationConnection[];
}

export interface AutomationBlock {
  id: string;
  type: AutomationBlockType;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface AutomationConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

// Segment filter types
export interface SegmentFilter {
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
}

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'notIn';
  value: unknown;
}

// Additional Types
export interface CustomerTags {
  VIP: 'vip',
  RTO_RISK: 'rto-risk',
  REPEAT: 'repeat-customer'
}

export interface StoreContext {
  id: string;
  shopifyDomain: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  
  // Shopify
  shopifyAccessToken?: string;
  shopifyApiKey?: string;
  shopifyApiSecret?: string;
  shopifyWebhookSecret?: string;
  
  // WhatsApp
  waAppId?: string;
  waAppSecret?: string;
  waAccessToken?: string;
  waPhoneNumberId?: string;
  waWabaId?: string;
  waVerifyToken?: string;
  waWebhookSecret?: string;
  waApiVersion?: string;

  // Settings
  brandName?: string;
  supportNumber?: string;
  defaultCountry?: string;
  defaultLanguage?: string;
  
  isIntegrationComplete: boolean;
}
