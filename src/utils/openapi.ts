import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createPostSchema } from '../schemas/posts.schemas.js';
import { z } from 'zod';

export const registry = new OpenAPIRegistry();

// Register your Post schema so Swagger knows what it looks like
registry.register('Post', createPostSchema);

// Define the actual endpoint documentation
registry.registerPath({
  method: 'post',
  path: '/posts',
  summary: 'Create a new blog post',
  request: {
    body: {
      content: {
        'application/json': { schema: z.object({
          title: z.string(),
          content: z.string(),
          authorId: z.number(),
          published: z.boolean().optional(),
        }) },
      },
    },
  },
  responses: {
    201: {
      description: 'Post created successfully',
    },
  },
});

export function generateOpenApiDocs() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'My Backend Journey API',
      version: '1.0.0',
      description: 'Learning PostgreSQL, Prisma, and Zod',
    },
  });
}
