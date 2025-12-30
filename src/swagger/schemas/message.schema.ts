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
      contentType: {
        type: 'string',
        enum: ['text', 'attachment'],
        example: 'text',
      },
      status: {
        type: 'string',
        enum: ['sent', 'received', 'read'],
        example: 'sent',
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
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'Message created',
      },
      data: {
        $ref: '#/components/schemas/Message',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  MessagesListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Conversation fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Message',
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
            example: 50,
          },
          totalItems: {
            type: 'integer',
            example: 150,
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
  ConversationsListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Conversations fetched',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: 'user-789',
            },
            lastMessage: {
              $ref: '#/components/schemas/Message',
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
  DeleteMessageResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Message deleted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
