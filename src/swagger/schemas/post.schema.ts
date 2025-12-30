export const postSchemas = {
  Post: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'post-123',
      },
      posterId: {
        type: 'string',
        example: 'user-456',
      },
      content: {
        type: 'string',
        example: 'This is a sample post content',
      },
      originalPostId: {
        type: 'string',
        nullable: true,
        example: null,
      },
      reactionCount: {
        type: 'integer',
        example: 10,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  PostBody: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        example: 'This is my post content',
      },
      originalPostId: {
        type: 'string',
        nullable: true,
        example: null,
      },
      attachments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            attachmentUrl: {
              type: 'string',
              example: 'https://example.com/image.png',
            },
            type: {
              type: 'string',
              enum: ['image', 'video', 'audio'],
              example: 'image',
            },
          },
        },
      },
    },
  },
  UpdatePostBody: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        example: 'Updated post content',
      },
    },
  },
  Reaction: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'reaction-123',
      },
      postId: {
        type: 'string',
        example: 'post-123',
      },
      reactorId: {
        type: 'string',
        example: 'user-789',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  PostResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'Post created',
      },
      data: {
        $ref: '#/components/schemas/Post',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  PostsListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Posts fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Post',
        },
      },
      meta: {
        type: 'object',
        properties: {
          currentPage: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 20,
          },
          totalItems: {
            type: 'integer',
            example: 100,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
        },
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  ReactionsListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Reactions fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Reaction',
        },
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  ReactionResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'Post reacted',
      },
      data: {
        $ref: '#/components/schemas/Reaction',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  MessageResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Post deleted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
