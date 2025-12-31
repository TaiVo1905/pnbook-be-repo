import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import usersService from './users.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';

export const usersController = {
  getById: catchAsync(async (req: Request, res: Response) => {
    const user = await usersService.getById(req.params.id);
    const response = new ApiResponse(statusCodes.SUCCESS, 'User fetched', user);
    return res.status(response.statusCode).json(response);
  }),
  updateById: catchAsync(async (req: Request, res: Response) => {
    const updatedUserRequest = { userId: req.user!.id, data: req.body };
    const user = await usersService.updateById(updatedUserRequest);
    const response = new ApiResponse(statusCodes.SUCCESS, 'User updated', user);
    return res.status(response.statusCode).json(response);
  }),
};
