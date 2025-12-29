import { authSchemas } from './schemas/auth.schema.js';
import { commentSchemas } from './schemas/comment.schema.js';
import { tags } from './tag.swagger.js';

const option = {
  definition: {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'API Documentation',
      description: 'This is the API documentation for PNBOOK.',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Local server',
      },
    ],
    tags,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...authSchemas,
        ...commentSchemas,
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['src/**/*.swagger.ts'],
};
export default option;
