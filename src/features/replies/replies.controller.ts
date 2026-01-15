import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import repliesService from './replies.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import type { GetRepliesRequestDto } from './dtos/getRepliesRequest.dto.js';
import type { CreateReplyRequestDto } from './dtos/createReplyRequest.dto.js';
import type { UpdateReplyRequestDto } from './dtos/updateReplyRequest.dto.js';
import { REPLIES_MESSAGES } from './replies.messages.js';

export const repliesController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const createReplyPayload: CreateReplyRequestDto = {
      commentId: req.body.commentId,
      replierId: req.user!.id,
      content: req.body.content,
    };
    const reply = await repliesService.create(createReplyPayload);
    const response = ApiResponse.success(REPLIES_MESSAGES.REPLY_CREATED, reply);
    return res.status(response.statusCode).json(response);
  }),

  listByComment: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const getRepliesRequestDto: GetRepliesRequestDto = {
      commentId: String(req.params.id),
      page,
      limit,
    };
    const { list, count } =
      await repliesService.listByComment(getRepliesRequestDto);
    const response = ApiResponse.paginated(
      REPLIES_MESSAGES.REPLIES_FETCHED,
      list,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const updateReplyPayload: UpdateReplyRequestDto = {
      replyId: String(req.params.id),
      replierId: req.user!.id,
      content: req.body.content,
    };
    const reply = await repliesService.update(updateReplyPayload);
    const response = ApiResponse.success(REPLIES_MESSAGES.REPLY_UPDATED, reply);
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await repliesService.remove(String(req.params.id), req.user!.id);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      REPLIES_MESSAGES.REPLY_DELETED
    );
    return res.status(response.statusCode).json(response);
  }),
};
