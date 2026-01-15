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

  triggerNewComment: async (data: {
    postId: string;
    commentId: string;
    commenterId: string;
    commenterName: string;
    commenterAvatar?: string;
    content: string;
  }) => {
    try {
      const db = firebase.db();
      await db
        .collection('posts')
        .doc(data.postId)
        .collection('comments')
        .doc(data.commentId)
        .set({
          id: data.commentId,
          commenterId: data.commenterId,
          commenterName: data.commenterName,
          commenterAvatar: data.commenterAvatar || null,
          content: data.content,
          createdAt: new Date().toISOString(),
        });
      return { triggered: true, commentId: data.commentId };
    } catch (_err: any) {
      return { triggered: false, commentId: data.commentId };
    }
  },

  triggerNewReply: async (data: {
    postId: string;
    commentId: string;
    replyId: string;
    replierId: string;
    replierName: string;
    replierAvatar?: string;
    content: string;
  }) => {
    try {
      const db = firebase.db();
      await db
        .collection('posts')
        .doc(data.postId)
        .collection('comments')
        .doc(data.commentId)
        .collection('replies')
        .doc(data.replyId)
        .set({
          id: data.replyId,
          replierId: data.replierId,
          replierName: data.replierName,
          replierAvatar: data.replierAvatar || null,
          content: data.content,
          createdAt: new Date().toISOString(),
        });
      return { triggered: true, replyId: data.replyId };
    } catch (_err: any) {
      return { triggered: false, replyId: data.replyId };
    }
  },
};

export default firestoreService;
