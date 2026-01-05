import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import messagesService from './messages.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const messagesController = {
  listConversations: catchAsync(async (req: Request, res: Response) => {
    const userId = String(req.user!.id);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { conversations, totalItems } =
      await messagesService.listConversations(userId, page, limit);
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
    const { messages, totalItems } = await messagesService.listConversation(
      senderId,
      receiverId,
      page,
      limit
    );
    const response = ApiResponse.paginated('Conversation fetched', messages, {
      currentPage: page,
      limit,
      totalItems,
    });
    return res.status(response.statusCode).json(response);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const msg = await messagesService.create(
      req.user!.id,
      req.body.receiverId,
      req.body.content,
      req.body.contentType
    );
    const response = ApiResponse.created('Message created', msg);
    return res.status(response.statusCode).json(response);
  }),

  updateText: catchAsync(async (req: Request, res: Response) => {
    const msg = await messagesService.updateText(
      req.params.id,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.success('Message updated', msg);
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await messagesService.remove(req.params.id, req.user!.id);
    const response = new ApiResponse(statusCodes.SUCCESS, 'Message deleted');
    return res.status(response.statusCode).json(response);
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    await messagesService.markAsRead(req.user!.id, req.body.otherUserId);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'Messages marked as read'
    );
    return res.status(response.statusCode).json(response);
  }),
};
