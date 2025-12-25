import { statusCodes } from '@/core/statusCode.constant.js';
import { catchAsync } from '@/utils/catchAsync.js';
import type { Request, Response } from 'express';
import { signInService } from './signIn.service.js';
import COOKIE_OPTIONS from '@/shared/constants/cookieOption.js';
import { ApiResponse } from '@/core/apiResponse.js';

export const signIn = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await signInService(data);
  if (result.refreshToken) {
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
  }
  const response = ApiResponse.success('Sign in success', {
    accessToken: result.accessToken,
  });
  return res.status(statusCodes.SUCCESS).json(response);
});
