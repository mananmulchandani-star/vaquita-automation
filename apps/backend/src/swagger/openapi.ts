export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'VAQUITA Automation API',
    version: '1.0.0',
    description: 'API documentation for VAQUITA Automation Platform backend services. This includes integrations with Shopify Admin API and Meta WhatsApp Business API for managing high-volume customer communication and reducing COD RTO rates.',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API V1',
    },
    {
      url: '/api',
      description: 'Base API',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme.',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API Key for service-to-service communication.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'An error occurred',
          },
          errors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['success', 'message'],
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          version: {
            type: 'string',
            example: '1.0.0',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check endpoint',
        description: 'Returns the health status of the API.',
        security: [], // Open endpoint
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
          '503': {
            description: 'Service Unavailable',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};
