import paths from './paths/index.js';
import schemas from './schemas/index.js';

export default {
  openapi: '3.0.0',
  info: {
    title: 'My Backend Journey API',
    version: '1.0.0',
    description: 'Learning PostgreSQL, Prisma, and Zod',
  },
  servers: [{ url: 'http://localhost:2200' }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
      },
    },
    schemas: {
      ...schemas,
    },
  },
  paths: {
    ...paths,
  },
};
