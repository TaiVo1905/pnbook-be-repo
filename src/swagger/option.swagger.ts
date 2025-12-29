import { authSchemas } from './schemas/auth.schema.js';
import { commentSchemas } from './schemas/comment.schema.js';
import { friendShipSchemas } from './schemas/friendShip.schema.js';
import { messageSchemas } from './schemas/message.schema.js';
import { tags } from './tag.swagger.js';
import { notifcationSchemas } from './schemas/notification.schema.js';
import { postSchemas } from './schemas/post.schema.js';
import { repliesSchemas } from './schemas/reply.schema.js';
import { searchSchemas } from './schemas/search.schema.js';
import { uploadSchemas } from './schemas/upload.schema.js';

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
        ...messageSchemas,
        ...friendShipSchemas,
        ...notifcationSchemas,
        ...postSchemas,
        ...repliesSchemas,
        ...searchSchemas,
        ...uploadSchemas,
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['src/**/*.swagger.ts'],
};
export default option;
