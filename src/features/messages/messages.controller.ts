import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import messagesService from './messages.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import type { ListConversationRequestDto } from './dtos/listConversationRequest.dto.js';
import type { ListConversationsRequestDto } from './dtos/listConversationsRequest.dto.js';
import { MESSAGES_MESSAGES } from './messages.messages.js';

export const messagesController = {
  listConversations: catchAsync(async (req: Request, res: Response) => {
    const userId = String(req.user!.id);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const listConversationsPayload: ListConversationsRequestDto = {
      userId,
      page,
      limit,
    };
    const { conversations, totalItems } =
      await messagesService.listConversations(listConversationsPayload);
    const response = ApiResponse.paginated(
      'Conversations fetched',
      conversations,
      { currentPage: page, limit, totalItems }
    );
    return res.status(response.statusCode).json(response);
  }),

  listConversation: catchAsync(async (req: Request, res: Response) => {
    const senderId = String(req.user!.id);
    const receiverId = String(req.query.receiverId);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const listConversationPayload: ListConversationRequestDto = {
      senderId,
      receiverId,
      page,
      limit,
    };
    const { messages, totalItems } = await messagesService.listConversation(
      listConversationPayload
    );
    const response = ApiResponse.paginated(
      MESSAGES_MESSAGES.CONVERSATION_FETCHED,
      messages,
      {
        currentPage: page,
        limit,
        totalItems,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const createMessagePayload = {
      senderId: String(req.user!.id),
      receiverId: String(req.body.receiverId),
      content: String(req.body.content),
      contentType: req.body.contentType || 'text',
    };
    const msg = await messagesService.create(createMessagePayload);
    const response = ApiResponse.created(
      MESSAGES_MESSAGES.MESSAGE_CREATED,
      msg
    );
    return res.status(response.statusCode).json(response);
  }),

  updateText: catchAsync(async (req: Request, res: Response) => {
    const updateTextPayload = {
      id: req.params.id,
      actorId: req.user!.id,
      content: req.body.content,
    };
    const msg = await messagesService.updateText(updateTextPayload);
    const response = ApiResponse.success(
      MESSAGES_MESSAGES.MESSAGE_UPDATED,
      msg
    );
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await messagesService.remove(req.params.id, req.user!.id);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      MESSAGES_MESSAGES.MESSAGE_DELETED
    );
    return res.status(response.statusCode).json(response);
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    await messagesService.markAsRead(req.user!.id, req.body.otherUserId);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      MESSAGES_MESSAGES.MESSAGES_MARKED_AS_READ
    );
    return res.status(response.statusCode).json(response);
  }),
};
