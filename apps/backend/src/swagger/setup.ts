import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { openApiSpec } from './openapi';

/**
 * Sets up Swagger UI Express on the provided application instance.
 * @param app - The Express application
 */
export function setupSwagger(app: Application): void {
  // Setup Swagger UI options
  const options: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    customSiteTitle: 'VAQUITA Automation API Documentation',
    customCss: '.swagger-ui .topbar { display: none }', // Hide the default Swagger top bar for a cleaner look
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  };

  // Mount the Swagger UI middleware
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, options)
  );
  
  // Also provide an endpoint to fetch the raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiSpec);
  });
}
