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
      keyword: {
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
  SearchHistoryListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Search history fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SearchHistory',
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
  MessageResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Search history deleted',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
