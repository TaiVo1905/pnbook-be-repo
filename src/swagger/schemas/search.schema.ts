export const searchSchemas = {
  SearchHistory: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'searchhistory-123',
      },
      userId: {
        type: 'string',
        example: 'user-456',
      },
      query: {
        type: 'string',
        example: 'search term',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  MessageResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Search history retrieved successfully',
      },
    },
  },
};
