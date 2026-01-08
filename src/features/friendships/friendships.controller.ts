import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import friendshipsService from './friendships.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const friendshipsController = {
  listMine: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const { list, count } = await friendshipsService.listMine(
      req.user!.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('Friends fetched', list, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  listOfUser: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const { list, count } = await friendshipsService.listOfUser(
      req.params.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('User friends fetched', list, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  listRequests: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const { list, count } = await friendshipsService.listRequests(
      req.user!.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('Friend requests fetched', list, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  sendRequest: catchAsync(async (req: Request, res: Response) => {
    const friendRequest = await friendshipsService.sendRequest(
      req.user!.id,
      req.body.addresseeId
    );
    const response = ApiResponse.created('Friend request sent', friendRequest);
    return res.status(response.statusCode).json(response);
  }),

  acceptRequest: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.acceptRequest(
      req.params.requesterId,
      req.user!.id
    );
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'Friend request accepted'
    );
    return res.status(response.statusCode).json(response);
  }),

  rejectRequest: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.rejectRequest(
      req.params.requesterId,
      req.user!.id
    );
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'Friend request rejected/cancelled'
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
      'Friendship status updated',
      friendship
    );
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await friendshipsService.remove(req.user!.id, req.params.friendId);
    const response = new ApiResponse(statusCodes.SUCCESS, 'Friendship deleted');
    return res.status(response.statusCode).json(response);
  }),
};
