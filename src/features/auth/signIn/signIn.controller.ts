import { statusCodes } from '@/core/statusCode.constant.js';
import { catchAsync } from '@/utils/catchAsync.js';
import type { Request, Response } from 'express';
import { signInService } from './signIn.service.js';

export const signIn = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await signInService(data);
  return res.status(statusCodes.SUCCESS).json(result);
});
