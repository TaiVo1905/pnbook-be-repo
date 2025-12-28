import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import notificationsService from './notifications.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const notificationsController = {
  listMine: catchAsync(async (req: Request, res: Response) => {
    const currentPage = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await notificationsService.listMine(
      req.user!.id,
      currentPage,
      limit
    );
    const response = ApiResponse.paginated('Notifications fetched', list, {
      currentPage,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const result = await notificationsService.markAsRead(
      req.params.id,
      req.user!.id
    );
    let response;
    if (result.count === 0) {
      response = new ApiResponse(
        statusCodes.NOT_FOUND,
        'Notification not found or already deleted'
      );
    } else {
      response = new ApiResponse(
        statusCodes.SUCCESS,
        'Notification marked as read'
      );
    }
    return res.status(response.statusCode).json(response);
  }),
};
