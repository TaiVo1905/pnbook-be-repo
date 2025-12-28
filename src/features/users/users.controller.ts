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
    const user = await usersService.updateById(req.params.id, req.body);
    const response = new ApiResponse(statusCodes.SUCCESS, 'User updated', user);
    return res.status(response.statusCode).json(response);
  }),
  search: catchAsync(async (req: Request, res: Response) => {
    const keyword = String(req.query.keyword || '');
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const users = await usersService.search(keyword, page, limit);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'Users fetched',
      users
    );
    return res.status(response.statusCode).json(response);
  }),
};
