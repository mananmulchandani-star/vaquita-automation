import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';
import { shopifyClient } from '@/lib/shopify';

export class ProductService {
  async getProducts(storeId: string, filters: { first?: number; after?: string; query?: string }) {
    const client = await shopifyClient(storeId);
    const { first = 50, after, query } = filters;

    const queryString = query ? `query: "${query}"` : '';
    const afterString = after ? `, after: "${after}"` : '';

    const gql = `
      query getProducts {
        products(first: ${first}${afterString}${queryString ? `, ${queryString}` : ''}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              status
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.execute(gql);
    return response.products;
  }

  async getProductById(storeId: string, productId: string) {
    const client = await shopifyClient(storeId);
    const idString = productId.includes('gid://') ? productId : `gid://shopify/Product/${productId}`;

    const gql = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          descriptionHtml
          status
          tags
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                inventoryQuantity
                inventoryItem {
                  id
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.execute(gql, { id: idString });
    return response.product;
  }

  async getInventoryLevels(storeId: string, inventoryItemIds: string[]) {
    const client = await shopifyClient(storeId);
    
    // We can fetch inventory levels by querying inventory items
    const queries = inventoryItemIds.map((id, index) => `
      item${index}: inventoryItem(id: "${id}") {
        id
        inventoryLevels(first: 5) {
          edges {
            node {
              id
              available
              location {
                id
                name
              }
            }
          }
        }
      }
    `).join('\n');

    const gql = `query { ${queries} }`;
    const response = await client.execute(gql);
    
    const results: any[] = [];
    Object.keys(response).forEach(key => {
      if (response[key]) {
        results.push(response[key]);
      }
    });

    return results;
  }

  async handleProductUpdate(storeId: string, payload: any) {
    logger.info(`Handling product update for store ${storeId}, product ${payload.id}`);
    
    // In our simplified schema, we don't store products in Postgres.
    return true;
  }

  async handleInventoryUpdate(storeId: string, payload: any) {
    logger.info(`Handling inventory update for store ${storeId}, inventory_item ${payload.inventory_item_id}`);
    
    // In our simplified schema, we don't track inventory in Postgres.
    return true;
  }
}

export const productService = new ProductService();
