export const notificationSchemas = {
  Notification: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'notification-123',
      },
      receiverId: {
        type: 'string',
        example: 'user-456',
      },
      title: {
        type: 'string',
        example: 'New Message',
      },
      content: {
        type: 'string',
        example: 'You have a new message',
      },
      targetDetails: {
        type: 'string',
        nullable: true,
        example: null,
      },
      isRead: {
        type: 'boolean',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  NotificationsListResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Notifications fetched',
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Notification',
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
            example: 100,
          },
          totalPages: {
            type: 'integer',
            example: 5,
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
  NotificationResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'Notification marked as read',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
