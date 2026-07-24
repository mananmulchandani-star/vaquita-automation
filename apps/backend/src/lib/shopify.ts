import axios, { AxiosInstance } from 'axios';
import { ExternalServiceError } from './errors';
import { logger } from '../config/logger';
import { getStoreContext } from '../utils/context';

export const SHOPIFY_QUERIES = {
  GET_ORDER: `
    query getOrder($id: ID!) {
      order(id: $id) {
        id
        name
        email
        phone
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        tags
        createdAt
      }
    }
  `,
  GET_ORDERS: `
    query getOrders($first: Int!, $after: String) {
      orders(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        edges {
          cursor
          node {
            id
            name
            createdAt
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `,
  GET_CUSTOMER: `
    query getCustomer($id: ID!) {
      customer(id: $id) {
        id
        firstName
        lastName
        email
        phone
      }
    }
  `,
  GET_PRODUCTS: `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `,
  UPDATE_ORDER_TAGS: `
    mutation tagsAdd($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        node {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  CREATE_DISCOUNT: `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 1) {
                nodes {
                  code
                }
              }
            }
          }
        }
        userErrors {
          field
          code
          message
        }
      }
    }
  `
};

export class ShopifyClient {
  private axios: AxiosInstance;
  private shopDomain: string;

  constructor(shopDomain: string, accessToken: string, apiVersion: string = '2025-07') {
    this.shopDomain = shopDomain;
    this.axios = axios.create({
      baseURL: `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`,
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    this.axios.interceptors.response.use(
      (response) => {
        // Handle GraphQL user errors if any
        if (response.data?.errors) {
          throw new Error(JSON.stringify(response.data.errors));
        }
        return response;
      },
      async (error) => {
        const config = error.config;
        if (!config || !config.retry) {
          config.retry = 0;
        }

        // Cost-based rate limiting handling (status 200 but error in body, or status 429)
        if (error.response?.status === 429 && config.retry < 3) {
           config.retry += 1;
           const retryAfter = error.response.headers['retry-after'] 
              ? parseInt(error.response.headers['retry-after']) * 1000 
              : 2000;
           logger.warn(`Shopify API throttled. Retrying in ${retryAfter}ms`);
           await new Promise(r => setTimeout(r, retryAfter));
           return this.axios(config);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async execute<T = any>(query: string, variables: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.axios.post('', { query, variables });
      
      // Additional check for GraphQL extensions cost throttle
      const throttleStatus = response.data?.extensions?.cost?.throttleStatus;
      if (throttleStatus && throttleStatus.currentlyAvailable < 100) {
        logger.warn(`Shopify API cost running low: ${throttleStatus.currentlyAvailable}`);
      }

      return response.data.data;
    } catch (error: any) {
       logger.error({ err: error.response?.data || error.message }, 'Shopify API Error');
       throw new ExternalServiceError('Failed to execute Shopify query', error.response?.data || error.message);
    }
  }
}

export const shopifyClient = async (storeId: string) => {
  const context = await getStoreContext(storeId);
  if (!context.shopifyAccessToken) {
    throw new Error(`Shopify integration not complete for store ${storeId}`);
  }
  return new ShopifyClient(context.shopifyDomain, context.shopifyAccessToken);
};
