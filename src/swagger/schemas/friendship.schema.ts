export const friendshipSchemas = {
  Friendship: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'friendship-123',
      },
      requesterId: {
        type: 'string',
        example: 'user-456',
      },
      addresseeId: {
        type: 'string',
        example: 'user-789',
      },
      status: {
        type: 'string',
        enum: ['accepted', 'block'],
        example: 'accepted',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  FriendshipResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'Friend request sent',
      },
      data: {
        $ref: '#/components/schemas/FriendShip',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  FriendListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Friends fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/FriendShip',
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
  SendFriendRequestBody: {
    type: 'object',
    required: ['addresseeId'],
    properties: {
      addresseeId: {
        type: 'string',
        example: 'user-789',
      },
    },
  },
  UpdateFriendshipBody: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['accepted', 'block'],
        example: 'block',
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
        example: 'Friend request accepted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
