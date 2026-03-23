import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'My Backend Journey API', version: '1.0.0', description: 'Learning PostgreSQL, Prisma, and Zod' },
    servers: [{ url: 'http://localhost:2200' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
        },
      },
    },
    paths: {
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          description: 'Get all users from the database',
          responses: {
            200: {
              description: 'Users retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get a user by ID',
          description: 'Get a user by ID from the database',
          responses: {
            200: {
              description: 'User retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      data: { $ref: '#/components/schemas/User' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/docs/swagger.components.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
