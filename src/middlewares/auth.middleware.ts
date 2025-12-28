import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/core/apiError.js';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/prisma.js';
import { config } from '@/config/index.js';

interface JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenFromCookie = req.cookies?.accessToken;
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return next(new UnauthorizedError());
    }

    const secretKey: string = config.jwt.secret!;
    const decoded: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next(new UnauthorizedError());
    }

    if (user.deletedAt) {
      return next(new ForbiddenError());
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token has expired'));
    }
    next(error);
  }
};
