import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/core/apiError.js';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/prisma.js';

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }
  const token: string = authHeader.split(' ')[1] as string;

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY!;
    const decoded: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;

    prisma.user.findUnique({ where: { id: decoded.id } }).then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      } else if (user.deletedAt) {
        throw new ForbiddenError();
      }

      req.user = user;
      next();
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    throw error;
  }
};
