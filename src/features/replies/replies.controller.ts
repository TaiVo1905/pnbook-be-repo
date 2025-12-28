import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import repliesService from './replies.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const repliesController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const reply = await repliesService.create(
      req.body.commentId,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.success('Reply created', reply);
    return res.status(response.statusCode).json(response);
  }),

  listByComment: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await repliesService.listByComment(
      req.params.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('Replies fetched', list, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const reply = await repliesService.update(
      req.params.id,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.success('Reply updated', reply);
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await repliesService.remove(req.params.id, req.user!.id);
    const response = new ApiResponse(statusCodes.SUCCESS, 'Reply deleted');
    return res.status(response.statusCode).json(response);
  }),
};
