export const commentSchemas = {
  CommentRequest: {
    type: 'object',
    required: ['content', 'postId'],
    properties: {
      content: {
        type: 'string',
        example: 'This is a comment',
      },
      postId: {
        type: 'string',
        example: 'post-123',
      },
    },
  },
  UpdateCommentRequest: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        example: 'This is an updated comment',
      },
    },
  },
  CommentResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'Comment created',
      },
      data: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'comment-789',
          },
          content: {
            type: 'string',
            example: 'This is a comment',
          },
          postId: {
            type: 'string',
            example: 'post-123',
          },
          commenterId: {
            type: 'string',
            example: 'user-456',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-10-01T12:34:56.789Z',
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
  CommentsListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Comments fetched',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'comment-789',
            },
            content: {
              type: 'string',
              example: 'This is a comment',
            },
            postId: {
              type: 'string',
              example: 'post-123',
            },
            commenterId: {
              type: 'string',
              example: 'user-456',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-10-01T12:34:56.789Z',
            },
          },
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
        example: 'Comment deleted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
