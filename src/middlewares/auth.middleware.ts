import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/core/apiError.js';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/prisma.js';
import { config } from '@/config/index.js';
import { AUTH_MESSAGES } from '@/features/auth/auth.messages.js';

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

    const hasValidRefreshToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id, deletedAt: null },
    });

    if (!hasValidRefreshToken) {
      return next(
        new UnauthorizedError(
          AUTH_MESSAGES.SESSION_EXPIRED_PLEASE_SIGN_IN_AGAIN
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError(AUTH_MESSAGES.TOKEN_EXPIRED));
    }
    next(error);
  }
};
