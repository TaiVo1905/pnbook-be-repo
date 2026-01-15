import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import usersService from './users.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import type { UpdateUserRequest } from './dtos/updateUserRequest.dto.js';
import { USERS_MESSAGES } from './users.messages.js';

export const usersController = {
  getById: catchAsync(async (req: Request, res: Response) => {
    const user = await usersService.getById(String(req.params.id));
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      USERS_MESSAGES.USER_FETCHED,
      user
    );
    return res.status(response.statusCode).json(response);
  }),

  updateById: catchAsync(async (req: Request, res: Response) => {
    const updatedUserRequest: UpdateUserRequest = {
      userId: req.user!.id,
      data: req.body,
    };
    const user = await usersService.updateById(updatedUserRequest);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      USERS_MESSAGES.USER_UPDATED,
      user
    );
    return res.status(response.statusCode).json(response);
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const userId = String(req.user!.id);
    const user = await usersService.getById(userId);
    const response = ApiResponse.success(USERS_MESSAGES.USER_FETCHED, user);
    return res.status(response.statusCode).json(response);
  }),

  getSuggestions: catchAsync(async (req: Request, res: Response) => {
    const suggestions = await usersService.getSuggestions(req.user!.id);
    const response = ApiResponse.success(
      USERS_MESSAGES.USER_SUGGESTIONS_FETCHED,
      suggestions
    );
    return res.status(response.statusCode).json(response);
  }),
};
