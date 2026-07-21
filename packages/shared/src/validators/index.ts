import { z } from 'zod';
import { 
  CampaignStatus, 
  AutomationTrigger, 
  DiscountType 
} from '../types/index.js';

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export const CreateCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  templateId: z.string().uuid(),
  segmentFilter: z.record(z.any()), // Can be typed stricter
  scheduledAt: z.string().datetime().optional(),
  abTestEnabled: z.boolean().default(false),
  abTestConfig: z.record(z.any()).optional(),
});

export const UpdateCampaignSchema = CreateCampaignSchema.partial().extend({
  status: z.nativeEnum(CampaignStatus).optional(),
});

export const SendMessageSchema = z.object({
  customerId: z.string().uuid(),
  templateName: z.string(),
  language: z.string().default('en'),
  variables: z.array(z.string()).optional(),
});

export const CreateAutomationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  triggerType: z.nativeEnum(AutomationTrigger),
  isActive: z.boolean().default(false),
  flowDefinition: z.record(z.any()),
  triggerConfig: z.record(z.any()).optional(),
});

export const UpdateSettingsSchema = z.object({
  category: z.string(),
  key: z.string(),
  value: z.record(z.any()),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(3),
  discountType: z.nativeEnum(DiscountType),
  value: z.number().positive(),
  minimumPurchase: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const FilterConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'in', 'notIn']),
  value: z.any()
});

export const SegmentFilterSchema = z.object({
  conditions: z.array(FilterConditionSchema),
  logic: z.enum(['AND', 'OR'])
});
