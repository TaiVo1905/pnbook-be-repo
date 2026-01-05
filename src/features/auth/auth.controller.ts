import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import authService from './auth.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import { setTokenCookie } from '@/utils/token.util.js';

export const authController = {
  signUpWithEmail: catchAsync(async (req: Request, res: Response) => {
    await authService.signUpWithEmail(req.body);
    const response = new ApiResponse(
      statusCodes.CREATED,
      'User registered successfully'
    );
    return res.status(response.statusCode).json(response);
  }),

  signInWithEmail: catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.signInWithEmail(req.body);

    setTokenCookie(res, tokens);

    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'User signed in successfully'
    );
    return res.status(response.statusCode).json(response);
  }),

  googleAuth: catchAsync(async (req: Request, res: Response) => {
    const { authCode } = req.body;
    const tokens = await authService.googleAuth(authCode);
    setTokenCookie(res, tokens);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'User signed in with Google successfully'
    );
    return res.status(response.statusCode).json(response);
  }),

  signOut: catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await authService.signOut(req.user.id);
    const apiResponse = new ApiResponse(
      statusCodes.SUCCESS,
      'User signed out successfully'
    );
    return res.status(apiResponse.statusCode).json(apiResponse);
  }),
};
