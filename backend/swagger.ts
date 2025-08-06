import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  encoding: 'utf8',
  failOnErrors: false,
  verbose: false,
  format: '.yaml',
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'MERN Blog API', version: '1.0.0' },
  },
  definition: {
    openapi: '3.0.0',
    info: { title: 'MERN Blog API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.ts'],
};

const spec = swaggerJsdoc(options);
export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(spec);
