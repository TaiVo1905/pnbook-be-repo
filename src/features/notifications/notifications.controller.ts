import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import notificationsService from './notifications.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import type { listNotificationRequestDto } from './dtos/listNotificationRequest.dto.js';
import type { MarkAsReadPayRequestDto } from './dtos/MarkAsReadRequest.dto.js';
import { NOTIFICATIONS_MESSAGES } from './notifications.messages.js';

export const notificationsController = {
  listMine: catchAsync(async (req: Request, res: Response) => {
    const currentPage = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const listNotificationPayload: listNotificationRequestDto = {
      userId: req.user!.id,
      page: currentPage,
      limit: limit,
    };
    const { list, count } = await notificationsService.listMine(
      listNotificationPayload
    );
    const response = ApiResponse.paginated(
      NOTIFICATIONS_MESSAGES.NOTIFICATIONS_FETCHED,
      list,
      {
        currentPage,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const markAsReadPayload: MarkAsReadPayRequestDto = {
      id: String(req.params.id),
      userId: req.user!.id,
    };

    const result = await notificationsService.markAsRead(markAsReadPayload);
    let response;
    if (result.count === 0) {
      response = new ApiResponse(
        statusCodes.NOT_FOUND,
        NOTIFICATIONS_MESSAGES.NOTIFICATION_NOT_FOUND_OR_ALREADY_DELETED
      );
    } else {
      response = new ApiResponse(
        statusCodes.SUCCESS,
        NOTIFICATIONS_MESSAGES.NOTIFICATION_MARKED_AS_READ
      );
    }
    return res.status(response.statusCode).json(response);
  }),
};
