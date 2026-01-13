import { authSchemas } from './schemas/auth.schema.js';
import { commentSchemas } from './schemas/comment.schema.js';
import { friendshipSchemas } from './schemas/friendship.schema.js';
import { messageSchemas } from './schemas/message.schema.js';
import { tags } from './tag.swagger.js';
import { notificationSchemas } from './schemas/notification.schema.js';
import { postSchemas } from './schemas/post.schema.js';
import { repliesSchemas } from './schemas/reply.schema.js';
import { searchSchemas } from './schemas/search.schema.js';
import { uploadSchemas } from './schemas/upload.schema.js';
import { userSchemas } from './schemas/user.schema.js';

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
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://pn-book-bj6tn.ondigitalocean.app/api/v1'
            : 'http://localhost:5001/api/v1',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Local server',
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
        ...friendshipSchemas,
        ...notificationSchemas,
        ...postSchemas,
        ...repliesSchemas,
        ...searchSchemas,
        ...uploadSchemas,
        ...userSchemas,
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['src*.swagger.ts'],
};
export default option;
