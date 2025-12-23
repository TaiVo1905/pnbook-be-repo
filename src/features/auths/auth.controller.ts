import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/util.catchAsync.js';
import { signInService } from './auth.service.js';

export const signIn = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await signInService(data);
  return res.status(200).json(result);
});
