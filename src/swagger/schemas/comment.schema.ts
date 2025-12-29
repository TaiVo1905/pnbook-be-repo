export const commentSchemas = {
  CommentRequest: {
    type: 'object',
    required: ['content', 'postId', 'commenterId'],
    properties: {
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
    },
  },
  CommentResponse: {
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
        example: '2024-10-01T12:34:56.789Z',
      },
      updatedAt: {
        type: 'string',
        example: '2024-10-01T12:34:56.789Z',
      },
      deletedAt: {
        type: 'string',
        example: null,
      },
    },
  },
};
