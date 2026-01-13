import { firebase } from '@/config/firebase.js';
import type { MessageRequestDto } from './dtos/messageRequest.dto.js';
import type { NotificationRequestDto } from './dtos/notificationRequest.dto.js';

const firestoreService = {
  triggerNewMessage: async (message: MessageRequestDto) => {
    try {
      const db = firebase.db();
      const convId = [message.senderId, message.receiverId].sort().join(':');
      await db
        .collection('conversations')
        .doc(convId)
        .collection('messages')
        .doc(message.id)
        .set(
          {
            id: message.id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            contentType: message.contentType,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      return { triggered: true, messageId: message.id };
    } catch (_err: any) {
      return { triggered: false, messageId: message.id };
    }
  },

  triggerNotification: async (notification: NotificationRequestDto) => {
    try {
      const db = firebase.db();
      await db
        .collection('notifications')
        .doc(notification.id)
        .set({
          id: notification.id,
          receiverId: notification.receiverId,
          title: notification.title,
          content: notification.content,
          targetDetails: notification.targetDetails || null,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      return { triggered: true, notificationId: notification.id };
    } catch (_err: any) {
      return { triggered: false, notificationId: notification.id };
    }
  },
};

export default firestoreService;
