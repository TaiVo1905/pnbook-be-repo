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
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  CreateRelyBody: {
    type: 'object',
    required: ['commentId', 'replierId', 'content'],
    properties: {
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
    },
  },
  UpdateReplyBody: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
      },
    },
  },
  RelyResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Reply updated successfully',
      },
    },
  },
};
