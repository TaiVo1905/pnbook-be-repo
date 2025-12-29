export const notifcationSchemas = {
  Notification: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'notification-123',
      },
      userId: {
        type: 'string',
        example: 'user-456',
      },
      type: {
        type: 'string',
        example: 'message',
      },
      content: {
        type: 'string',
        example: 'You have a new message',
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
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-01T12:34:56.789Z',
      },
    },
  },
  NotificationResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Notification marked as read successfully',
      },
    },
  },
};
