import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import friendshipsService from './friendships.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import { FRIENDSHIPS_MESSAGES } from './friendships.messages.js';

export const friendshipsController = {
  listMine: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await friendshipsService.listMine({
      userId: req.user!.id,
      page,
      limit,
    });
    const response = ApiResponse.paginated(
      FRIENDSHIPS_MESSAGES.FRIENDS_FETCHED,
      list,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  listOfUser: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await friendshipsService.listOfUser({
      userId: req.params.id,
      page,
      limit,
    });
    const response = ApiResponse.paginated(
      FRIENDSHIPS_MESSAGES.FRIENDS_FETCHED,
      list,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  listRequests: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { list, count } = await friendshipsService.listRequests({
      userId: req.user!.id,
      page,
      limit,
    });
    const response = ApiResponse.paginated(
      FRIENDSHIPS_MESSAGES.FRIEND_REQUESTS_FETCHED,
      list,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  sendRequest: catchAsync(async (req: Request, res: Response) => {
    const friendRequest = await friendshipsService.sendRequest({
      addresseeId: req.body.addresseeId,
      requesterId: req.user!.id,
    });
    const response = ApiResponse.created(
      FRIENDSHIPS_MESSAGES.FRIEND_REQUEST_SENT_CONTENT,
      friendRequest
    );
    return res.status(response.statusCode).json(response);
  }),

  acceptRequest: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.acceptRequest({
      addresseeId: req.user!.id,
      requesterId: req.params.requesterId,
    });

    const response = new ApiResponse(
      statusCodes.SUCCESS,
      FRIENDSHIPS_MESSAGES.REQUEST_ACCEPTED_CONTENT
    );
    return res.status(response.statusCode).json(response);
  }),

  rejectRequest: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.rejectRequest({
      addresseeId: req.user!.id,
      requesterId: req.params.requesterId,
    });

    const response = new ApiResponse(
      statusCodes.SUCCESS,
      FRIENDSHIPS_MESSAGES.REQUEST_REJECTED_CONTENT
    );
    return res.status(response.statusCode).json(response);
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const friendship = await friendshipsService.updateStatus(
      req.user!.id,
      req.params.friendId,
      req.body.status
    );
    const response = ApiResponse.success(
      FRIENDSHIPS_MESSAGES.FRIENDSHIP_STATUS_UPDATED,
      friendship
    );
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.remove(req.user!.id, req.params.friendId);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      FRIENDSHIPS_MESSAGES.FRIENDSHIP_DELETED
    );
    return res.status(response.statusCode).json(response);
  }),
};
