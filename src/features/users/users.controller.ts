import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import usersService from './users.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const usersController = {
  getByIdWithFriendship: catchAsync(async (req: Request, res: Response) => {
    const user = await usersService.getByIdWithFriendship(
      req.params.id,
      req.user!.id
    );
    const response = new ApiResponse(statusCodes.SUCCESS, 'User fetched', user);
    return res.status(response.statusCode).json(response);
  }),
  updateById: catchAsync(async (req: Request, res: Response) => {
    const updatedUserRequest = { userId: req.user!.id, data: req.body };
    const user = await usersService.updateById(updatedUserRequest);
    const response = new ApiResponse(statusCodes.SUCCESS, 'User updated', user);
    return res.status(response.statusCode).json(response);
  }),
  getMe: catchAsync(async (req: Request, res: Response) => {
    const userId = String(req.user!.id);
    const user = await usersService.getMe(userId);
    const response = ApiResponse.success('User fetched', user);
    return res.status(response.statusCode).json(response);
  }),

  getSuggestions: catchAsync(async (req: Request, res: Response) => {
    const suggestions = await usersService.getSuggestions(req.user!.id);
    const response = ApiResponse.success(
      'User suggestions fetched',
      suggestions
    );
    return res.status(response.statusCode).json(response);
  }),
};
