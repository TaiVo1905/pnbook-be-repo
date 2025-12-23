import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../utils/util.appError.js';

interface JwtPayload {
  userId: string;
}

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return next(new AppError('You are not Login!', 401, 'UNAUTHORIZED'));

  jwt.verify(token, config.jwt.accessSecretKey as string, (err, decoded) => {
    if (err) return next(new AppError('Invalid Token!', 401, 'INVALID_TOKEN'));

    (req as unknown as { user: JwtPayload }).user = decoded as JwtPayload;
    next();
  });
};
