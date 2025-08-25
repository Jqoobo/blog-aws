import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apisGlobs = [
  path.join(__dirname, './routes/*.ts'),
];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'MERN Blog API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:2527' }],
  },
  apis: apisGlobs,
};

const spec = swaggerJsdoc(options);
export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(spec, { explorer: true });
