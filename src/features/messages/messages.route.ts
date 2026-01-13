import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { messagesController } from './messages.controller.js';
import { messageSchema } from './schemas/message.schema.js';
import { listConversationSchema } from './schemas/listConversation.schema.js';
import { deleteMessageSchema } from './schemas/deleteMessage.schema.js';

const messagesRoutes = Router();
messagesRoutes.get('/conversations', messagesController.listConversations);
messagesRoutes.get(
  '/messages',
  validate(listConversationSchema),
  messagesController.listConversation
);
messagesRoutes.post(
  '/messages',
  validate(messageSchema),
  messagesController.create
);
messagesRoutes.patch(
  '/messages/:id',
  validate(messageSchema),
  messagesController.updateText
);
messagesRoutes.delete(
  '/messages/:id',
  validate(deleteMessageSchema),
  messagesController.remove
);

messagesRoutes.post('/messages/mark-as-read', messagesController.markAsRead);

export default messagesRoutes;
