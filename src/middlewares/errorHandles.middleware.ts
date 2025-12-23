import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/util.appError.js';

export const globalErrorHandler = (
  err: Error | AppError,

  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const error = err as AppError;
  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || 'INTERNAL_ERROR';
  const details = error.details || [];
  const message = error.message || 'Có lỗi xảy ra';

  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    code: statusCode * 10,
    error: {
      code: errorCode,
      message: message,
      details: details,
    },
  });
};
