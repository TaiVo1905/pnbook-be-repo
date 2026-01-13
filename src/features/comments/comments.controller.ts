import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import commentsService from './comments.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import { COMMENTS_MESSAGES } from './comments.messages.js';

export const commentsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const comment = await commentsService.create(
      req.body.postId,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.created(
      COMMENTS_MESSAGES.COMMENT_CREATED,
      comment
    );
    return res.status(response.statusCode).json(response);
  }),

  listByPost: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await commentsService.listByPost(
      req.params.id,
      page,
      limit
    );
    const response = ApiResponse.paginated(
      COMMENTS_MESSAGES.COMMENTS_FETCHED,
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
    const comment = await commentsService.update(
      req.params.id,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.success(
      COMMENTS_MESSAGES.COMMENT_UPDATED,
      comment
    );
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await commentsService.remove(req.params.id, req.user!.id);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      COMMENTS_MESSAGES.COMMENT_DELETED
    );
    return res.status(response.statusCode).json(response);
  }),
};
