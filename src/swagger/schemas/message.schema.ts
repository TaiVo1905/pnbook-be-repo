export const messageSchemas = {
  Message: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'message-123',
      },
      senderId: {
        type: 'string',
        example: 'user-456',
      },
      receiverId: {
        type: 'string',
        example: 'user-789',
      },
      content: {
        type: 'string',
        example: 'Hello, how are you?',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  SendMessageBody: {
    type: 'object',
    required: ['receiverId', 'content', 'contentType'],
    properties: {
      receiverId: {
        type: 'string',
        example: 'user-789',
      },
      content: {
        type: 'string',
        example: 'Hello, how are you?',
      },
      contentType: {
        type: 'string',
        enum: ['text', 'attachment'],
        example: 'text',
      },
    },
  },
  UpdateMessageBody: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'string',
        example: 'Updated message content',
      },
    },
  },
  MessageResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'message-123',
      },
    },
  },
};
