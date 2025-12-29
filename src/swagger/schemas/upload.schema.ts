export const uploadSchemas = {
  PresignedUrlRequest: {
    type: 'object',
    required: ['fileName', 'fileType'],
    properties: {
      fileName: {
        type: 'string',
        example: 'image.png',
      },
      fileType: {
        type: 'string',
        example: 'image/png',
      },
    },
  },
  PresignedUrlResponse: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        example:
          'https://example-bucket.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-',
      },
      fields: {
        type: 'object',
        example: {
          key: 'image.png',
          acl: 'public-read',
          'Content-Type': 'image/png',
          'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          'X-Amz-Credential': 'EXAMPLECREDENTIAL',
          'X-Amz-Date': '20240601T000000Z',
          'X-Amz-Expires': '3600',
          'X-Amz-Signature': 'EXAMPLESIGNATURE',
        },
      },
    },
  },
  LimitedTimeUrlRequest: {
    type: 'object',
    required: ['fileKey', 'expiresIn'],
    properties: {
      fileKey: {
        type: 'string',
        example: 'image.png',
      },
      expiresIn: {
        type: 'integer',
        example: 3600,
      },
    },
  },
  LimitedTimeUrlResponse: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        example:
          'https://example-bucket.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-',
      },
      expiresAt: {
        type: 'string',
        example: '2024-06-01T01:00:00.000Z',
      },
    },
  },
};
