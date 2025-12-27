import messageRepository from '@/shared/repositories/message.repository.js';
import firestoreService from '@/infrastructure/firestore.service.js';
import uploadsService from '@/features/uploads/uploads.service.js';
import { ForbiddenError, NotFoundError } from '@/core/apiError.js';

const messagesService = () => {
  const hydrateMessage = async (msg: any) => {
    if (msg.contentType === 'attachment') {
      return {
        ...msg,
        content: await uploadsService.getLimitedTimeUrl(msg.content),
      };
    }
    return msg;
  };

  const listConversation = async (
    senderId: string,
    receiverId: string,
    page = 1,
    limit = 50
  ) => {
    if (senderId === receiverId) {
      return { messages: [], totalItems: 0 };
    }

    const { messages, totalItems } = await messageRepository.listConversation(
      senderId,
      receiverId,
      page,
      limit
    );
    const hydratedMessages = await Promise.all(
      messages.map((m) => hydrateMessage(m))
    );
    return { messages: hydratedMessages, totalItems };
  };

  const listConversations = async (userId: string, page = 1, limit = 20) => {
    const { conversations, totalItems } =
      await messageRepository.listConversations(userId, page, limit);
    const hydratedConversations = await Promise.all(
      conversations.map(async (conv) => ({
        ...conv,
        lastMessage: conv.lastMessage
          ? await hydrateMessage(conv.lastMessage)
          : null,
        status: conv.lastMessage ? conv.lastMessage.status : null,
      }))
    );
    return { conversations: hydratedConversations, totalItems };
  };

  const create = async (
    senderId: string,
    receiverId: string,
    content: string,
    contentType: 'text' | 'attachment'
  ) => {
    const msg = await messageRepository.create(
      senderId,
      receiverId,
      content,
      contentType
    );

    await firestoreService.triggerNewMessage({
      id: msg.id,
      senderId,
      receiverId,
      content,
      contentType: contentType,
    });
    return await hydrateMessage(msg);
  };

  const updateText = async (id: string, actorId: string, content: string) => {
    const msg = await messageRepository.getById(id);
    if (!msg) throw new NotFoundError('Message not found');
    if (msg.deletedAt) throw new Error('Cannot edit deleted message');
    if (msg.senderId !== actorId)
      throw new ForbiddenError("Forbidden: cannot edit others' message");
    return await messageRepository.updateText(id, content);
  };

  const remove = async (id: string, actorId: string) => {
    const msg = await messageRepository.getById(id);
    if (!msg) throw new NotFoundError('Message not found');
    if (msg.deletedAt) throw new Error('Message already deleted');
    if (msg.senderId !== actorId) {
      throw new ForbiddenError("Cannot delete others' message");
    }
    return await messageRepository.remove(id);
  };

  return { listConversation, listConversations, create, updateText, remove };
};

export default messagesService();
