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
        example: 'nguyendat@example.com',
      },
      avatarUrl: {
        type: 'string',
        example: 'https://example.com/avatars/user-123.jpg',
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
};
