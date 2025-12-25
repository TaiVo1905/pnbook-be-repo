import type { Request, Response } from 'express';
import { registerWithEmail } from './signUp.service.js';
import { catchAsync } from '@/utils/catchAsync.js';
import { ApiResponse } from '@/core/apiResponse.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await registerWithEmail(req.body);

  const response = ApiResponse.created('User registered successfully', result);

  return res.status(response.statusCode).json(response);
});
