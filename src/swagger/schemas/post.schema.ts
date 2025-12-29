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
      attachment: {
        type: 'string',
        example: 'http://example.com/image.png',
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
  PostBody: {
    type: 'object',
    required: ['posterId', 'content'],
    properties: {
      posterId: {
        type: 'string',
        example: 'user-456',
      },
      content: {
        type: 'string',
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
      type: {
        type: 'string',
        example: 'like',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  ReactBody: {
    type: 'object',
    required: ['reactorId', 'type'],
    properties: {
      reactorId: {
        type: 'string',
        example: 'user-789',
      },
      type: {
        type: 'string',
        example: 'like',
      },
    },
  },
  ReactionResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Reaction added successfully',
      },
    },
  },
  PostResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Post created successfully',
      },
    },
  },
};
