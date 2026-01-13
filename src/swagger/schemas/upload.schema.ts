export const uploadSchemas = {
  PresignedUrlRequest: {
    type: 'object',
    required: ['filename', 'mimeType'],
    properties: {
      filename: {
        type: 'string',
        example: 'image.png',
      },
      mimeType: {
        type: 'string',
        example: 'image/png',
      },
    },
  },
  PresignedUrlResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Upload URL created',
      },
      data: {
        type: 'object',
        properties: {
          urlKey: {
            type: 'string',
            example: 'uploads/1234567890-image.png',
          },
          url: {
            type: 'string',
            example:
              'https://example-bucket.s3.amazonaws.com/uploads/1234567890-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&...',
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
  LimitedTimeUrlRequest: {
    type: 'object',
    required: ['urlKey'],
    properties: {
      urlKey: {
        type: 'string',
        example: 'uploads/1234567890-image.png',
      },
    },
  },
  LimitedTimeUrlResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Limited Time URL fetched',
      },
      data: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            example:
              'https://example-bucket.s3.amazonaws.com/uploads/1234567890-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&...',
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
};
