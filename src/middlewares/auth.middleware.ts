import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/core/apiError.js';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/prisma.js';

interface JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError());
    }
    const token: string = authHeader.split(' ')[1] as string;

    const secretKey: string = process.env.JWT_SECRET_KEY!;
    const decoded: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next(new UnauthorizedError());
    } else if (user.deletedAt) {
      return next(new ForbiddenError());
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token has expired'));
    }
    next(error);
  }
};
