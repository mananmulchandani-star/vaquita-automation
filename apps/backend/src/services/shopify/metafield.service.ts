import { logger } from '../../config/logger';
import { shopifyClient } from '../../lib/shopify';

export class MetafieldService {
  async getMetafields(storeId: string, ownerId: string, ownerType: string) {
    logger.info(`Fetching metafields for ${ownerType} ${ownerId} in store ${storeId}`);
    const client = await shopifyClient(storeId);

    const formattedId = ownerId.includes('gid://') ? ownerId : `gid://shopify/${ownerType}/${ownerId}`;

    const query = `
      query getMetafields($id: ID!) {
        node(id: $id) {
          id
          ... on HasMetafields {
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.execute(query, { id: formattedId });
    return response.node?.metafields?.edges.map((e: any) => e.node) || [];
  }

  async setMetafield(storeId: string, params: { ownerId: string; namespace: string; key: string; value: string; type: string }) {
    logger.info(`Setting metafield for ${params.ownerId} in store ${storeId}`);
    const client = await shopifyClient(storeId);

    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      ownerId: params.ownerId,
      namespace: params.namespace,
      key: params.key,
      value: params.value,
      type: params.type,
    };

    const response = await client.execute(mutation, { metafields: [input] });

    if (response.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(`Failed to set metafield: ${response.metafieldsSet.userErrors[0].message}`);
    }

    return response.metafieldsSet.metafields[0];
  }
}

export const metafieldService = new MetafieldService();
