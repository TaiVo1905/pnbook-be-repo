export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'user-123',
      },
      name: {
        type: 'string',
        example: 'Nguyendat',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'nguyendat@example.com',
      },
      avatarUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/avatars/user-123.jpg',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  UserUpdateRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Nguyendat',
      },
      avatarUrl: {
        type: 'string',
        example: 'https://example.com/avatars/user-123-updated.jpg',
      },
    },
  },
  UserResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'User fetched',
      },
      data: {
        $ref: '#/components/schemas/User',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  UsersListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Users fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User',
        },
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
