import type { Request, Response } from 'express';
import { registerWithEmail } from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await registerWithEmail(req.body);

  return res.status(201).json({
    status: 'success',
    code: '2001',
    message: 'User registered successfully',
    data: result,
  });
});
