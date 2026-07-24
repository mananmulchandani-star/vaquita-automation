import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { shopifyClient } from '../../lib/shopify';

export class DiscountService {
  async createDiscount(storeId: string, params: { code: string; type: 'percentage' | 'fixed_amount'; value: number; minimumPurchase?: number; usageLimit?: number; expiresAt?: Date }) {
    logger.info(`Creating discount ${params.code} for store ${storeId}`);
    const client = await shopifyClient(storeId);

    // 1. Create Price Rule
    const priceRuleMutation = `
      mutation priceRuleCreate($priceRule: PriceRuleInput!) {
        priceRuleCreate(priceRule: $priceRule) {
          priceRule {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const priceRuleInput: any = {
      title: params.code,
      targetType: 'LINE_ITEM',
      targetSelection: 'ALL',
      allocationMethod: 'ACROSS',
      valueType: params.type === 'percentage' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
      value: `-${params.value}`,
      customerSelection: 'ALL',
      startsAt: new Date().toISOString(),
    };

    if (params.minimumPurchase) {
      priceRuleInput.prerequisiteSubtotalRange = {
        greaterThanOrEqualTo: params.minimumPurchase.toString(),
      };
    }
    
    if (params.usageLimit) {
      priceRuleInput.usageLimit = params.usageLimit;
    }

    if (params.expiresAt) {
      priceRuleInput.endsAt = params.expiresAt.toISOString();
    }

    const priceRuleResponse = await client.execute(priceRuleMutation, { priceRule: priceRuleInput });
    
    if (priceRuleResponse.priceRuleCreate?.userErrors?.length > 0) {
      throw new Error(`Failed to create price rule: ${priceRuleResponse.priceRuleCreate.userErrors[0].message}`);
    }

    const priceRuleId = priceRuleResponse.priceRuleCreate.priceRule.id;

    // 2. Create Discount Code
    const discountCodeMutation = `
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Note: The GraphQL API has changed, discountCodeBasicCreate is the modern way, 
    // but requires a different setup than priceRuleCreate.
    // For this implementation, we will use the legacy discountCodeCreate if we used priceRuleCreate.
    const legacyDiscountCodeMutation = `
      mutation discountCodeCreate($priceRuleId: ID!, $code: String!) {
        discountCodeCreate(priceRuleId: $priceRuleId, code: $code) {
          discountCode {
            id
            code
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const discountCodeResponse = await client.execute(legacyDiscountCodeMutation, {
      priceRuleId,
      code: params.code,
    });

    if (discountCodeResponse.discountCodeCreate?.userErrors?.length > 0) {
      throw new Error(`Failed to create discount code: ${discountCodeResponse.discountCodeCreate.userErrors[0].message}`);
    }

    const shopifyDiscountId = discountCodeResponse.discountCodeCreate.discountCode.id;

    // Save to CouponCode table
    const coupon = await prisma.couponCode.create({
      data: {
        storeId,
        code: params.code,
        shopifyPriceRuleId: priceRuleId,
        shopifyDiscountId: shopifyDiscountId,
        discountType: params.type === 'percentage' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        value: params.value,
        isActive: true,
        expiresAt: params.expiresAt,
      }
    });

    return coupon;
  }

  async deactivateDiscount(storeId: string, couponId: string) {
    const coupon = await prisma.couponCode.findUnique({ where: { id: couponId } });
    if (!coupon) throw new Error('Coupon not found');

    const client = await shopifyClient(storeId);
    
    // To deactivate, we typically update the price rule to end now or delete it
    // We'll delete the discount code
    const deleteMutation = `
      mutation discountCodeDelete($id: ID!) {
        discountCodeDelete(id: $id) {
          deletedDiscountCodeId
          userErrors {
            field
            message
          }
        }
      }
    `;

    if (!coupon.shopifyDiscountId) throw new Error('Missing shopifyDiscountId');
    await client.execute(deleteMutation, { id: coupon.shopifyDiscountId });

    return prisma.couponCode.update({
      where: { id: couponId },
      data: { isActive: false },
    });
  }

  async getCoupons(storeId: string, filters: { skip?: number; take?: number; active?: boolean }) {
    const { skip = 0, take = 50, active } = filters;
    const where: any = { storeId };
    
    if (active !== undefined) {
      where.isActive = active;
      if (active) {
        where.OR = [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ];
      }
    }

    const [total, coupons] = await prisma.$transaction([
      prisma.couponCode.count({ where }),
      prisma.couponCode.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, coupons };
  }

  generateUniqueCouponCode(prefix: string): string {
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${randomString}`;
  }
}

export const discountService = new DiscountService();
