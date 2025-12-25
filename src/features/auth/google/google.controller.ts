import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import { googleService } from './google.service.js';
import COOKIE_OPTIONS from '@/shared/constants/cookieOption.js';
import { ApiResponse } from '@/core/apiResponse.js';

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const { authCode } = req.body;
  const response = await googleService(authCode);
  res.cookie('refreshToken', response.refreshToken, COOKIE_OPTIONS);
  const result = ApiResponse.success('success', {
    accessToken: response.accessToken,
  });
  return res.status(result.statusCode).json(result);
});
