export const friendShipSchemas = {
  FriendShip: {
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
        enum: ['pending', 'accepted', 'block'],
        example: 'pending',
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
  FriendListResponse: {
    type: 'object',
    properties: {
      list: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/FriendShip',
        },
      },
      count: {
        type: 'integer',
        example: 10,
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
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        example: 'accepted',
      },
    },
  },
  DeleteFriendshipResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Friendship deleted successfully',
      },
    },
  },
  MessageResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Action successful',
      },
    },
  },
};
