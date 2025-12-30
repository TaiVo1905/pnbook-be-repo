export const repliesSchemas = {
  Reply: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'reply-123',
      },
      commentId: {
        type: 'string',
        example: 'comment-456',
      },
      replierId: {
        type: 'string',
        example: 'user-789',
      },
      content: {
        type: 'string',
        example: 'This is a reply to the comment',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  CreateReplyBody: {
    type: 'object',
    required: ['commentId', 'content'],
    properties: {
      commentId: {
        type: 'string',
        example: 'comment-456',
      },
      content: {
        type: 'string',
        example: 'This is a reply to the comment',
      },
    },
  },
  UpdateReplyBody: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        example: 'This is an updated reply',
      },
    },
  },
  ReplyResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Reply created',
      },
      data: {
        $ref: '#/components/schemas/Reply',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  RepliesListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Replies fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Reply',
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
            example: 50,
          },
          totalPages: {
            type: 'integer',
            example: 3,
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
  MessageResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Reply deleted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
