import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { shopifyClient } from '../../lib/shopify';

export class DraftOrderService {
  async createDraftOrder(storeId: string, params: { customerId?: string; lineItems: any[]; shippingAddress?: any; note?: string; tags?: string[] }) {
    logger.info(`Creating draft order for store ${storeId}`);
    const client = await shopifyClient(storeId);

    const input: any = {
      lineItems: params.lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        originalUnitPrice: item.price ? item.price.toString() : undefined,
      })),
    };

    if (params.customerId) {
      // Must be a global ID
      input.customerId = params.customerId.includes('gid://') ? params.customerId : `gid://shopify/Customer/${params.customerId}`;
    }

    if (params.shippingAddress) {
      input.shippingAddress = params.shippingAddress;
    }

    if (params.note) {
      input.note = params.note;
    }

    if (params.tags && params.tags.length > 0) {
      input.tags = params.tags.join(', ');
    }

    const mutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            invoiceUrl
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await client.execute(mutation, { input });

    if (response.draftOrderCreate?.userErrors?.length > 0) {
      throw new Error(`Failed to create draft order: ${response.draftOrderCreate.userErrors[0].message}`);
    }

    return response.draftOrderCreate.draftOrder;
  }

  async completeDraftOrder(storeId: string, draftOrderId: string) {
    logger.info(`Completing draft order ${draftOrderId} for store ${storeId}`);
    const client = await shopifyClient(storeId);

    const id = draftOrderId.includes('gid://') ? draftOrderId : `gid://shopify/DraftOrder/${draftOrderId}`;

    const mutation = `
      mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
        draftOrderComplete(id: $id, paymentPending: $paymentPending) {
          draftOrder {
            id
            order {
              id
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await client.execute(mutation, { id, paymentPending: false });

    if (response.draftOrderComplete?.userErrors?.length > 0) {
      throw new Error(`Failed to complete draft order: ${response.draftOrderComplete.userErrors[0].message}`);
    }

    return response.draftOrderComplete.draftOrder.order;
  }
}

export const draftOrderService = new DraftOrderService();
