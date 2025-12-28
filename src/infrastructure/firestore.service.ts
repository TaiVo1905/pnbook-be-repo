import { firebase } from '@/config/firebase.js';

const firestoreService = () => {
  const triggerNewMessage = async (message: {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    contentType: 'text' | 'attachment';
  }) => {
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
  };
  return { triggerNewMessage };
};

export default firestoreService();
