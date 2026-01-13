import messageRepository from '@/shared/repositories/message.repository.js';
import firestoreService from '@/infrastructure/firestore.service.js';
import uploadsService from '@/features/uploads/uploads.service.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/core/apiError.js';
import {
  checkOwnership,
  checkDeletePermission,
} from '@/utils/authorization.util.js';
import { MESSAGES_MESSAGES } from './messages.messages.js';
import type { ListConversationRequestDto } from './dtos/listConversationRequest.dto.js';
import type { ListConversationsRequestDto } from './dtos/listConversationsRequest.dto.js';
import type { createMessageRequestDto } from './dtos/createMessageRequest.dto.js';
import type { UpdateTextRequestDto } from './dtos/updateTextRequest.dto.js';

const messagesService = {
  hydrateMessage: async (msg: any) => {
    if (msg.contentType === 'attachment') {
      return {
        ...msg,
        content: await uploadsService.getLimitedTimeUrl(msg.content),
      };
    }
    return msg;
  },

  listConversation: async (
    listConversationPayload: ListConversationRequestDto
  ) => {
    if (
      listConversationPayload.senderId === listConversationPayload.receiverId
    ) {
      return { messages: [], totalItems: 0 };
    }

    const { messages, totalItems } = await messageRepository.listConversation(
      listConversationPayload
    );
    const hydratedMessages = await Promise.all(
      messages.map((m) => messagesService.hydrateMessage(m))
    );
    return { messages: hydratedMessages, totalItems };
  },

  listConversations: async (
    listConversationsPayload: ListConversationsRequestDto
  ) => {
    const { conversations, totalItems } =
      await messageRepository.listConversations(listConversationsPayload);
    const hydratedConversations = await Promise.all(
      conversations.map(async (conv) => ({
        ...conv,
        lastMessage: conv.lastMessage
          ? await messagesService.hydrateMessage(conv.lastMessage)
          : null,
        status: conv.lastMessage ? conv.lastMessage.status : null,
      }))
    );
    return { conversations: hydratedConversations, totalItems };
  },

  create: async (createMessagePayload: createMessageRequestDto) => {
    const msg = await messageRepository.create(createMessagePayload);

    await firestoreService.triggerNewMessage({
      id: msg.id,
      ...createMessagePayload,
    });
    return await messagesService.hydrateMessage(msg);
  },

  updateText: async (updateTextPayload: UpdateTextRequestDto) => {
    const msg = await messageRepository.getById(updateTextPayload.id);
    if (!msg) throw new NotFoundError(MESSAGES_MESSAGES.MESSAGE_NOT_FOUND);
    if (msg.deletedAt)
      throw new ForbiddenError(MESSAGES_MESSAGES.CANNOT_EDIT_DELETED_MESSAGE);
    checkOwnership(msg.senderId, updateTextPayload.actorId, 'message');
    return await messageRepository.updateText({
      id: updateTextPayload.id,
      content: updateTextPayload.content,
    });
  },

  remove: async (id: string, actorId: string) => {
    const msg = await messageRepository.getById(id);
    if (!msg) throw new NotFoundError(MESSAGES_MESSAGES.MESSAGE_NOT_FOUND);
    if (msg.deletedAt)
      throw new BadRequestError(MESSAGES_MESSAGES.MESSAGE_ALREADY_DELETED);
    checkDeletePermission(msg.senderId, actorId, 'message');
    return await messageRepository.remove(id);
  },

  markAsRead: async (userId: string, otherUserId: string) => {
    return await messageRepository.markAsRead(userId, otherUserId);
  },
};

export default messagesService;
