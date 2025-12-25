import { prisma } from '@/utils/prisma.js';
import crypto from 'crypto';

export const RefreshTokenRepository = () => {
  const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
  };

  const createRefreshToken = async (userId: string, token: string) => {
    const tokenHash = hashToken(token);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    return await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiryDate,
      },
    });
  };

  const findValidRefreshToken = async (token: string) => {
    const tokenHash = hashToken(token);

    return await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        expiryDate: {
          gt: new Date(),
        },
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });
  };

  const deleteRefreshToken = async (token: string) => {
    const tokenHash = hashToken(token);

    return await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  };

  const deleteAllUserRefreshTokens = async (userId: string) => {
    return await prisma.refreshToken.updateMany({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  };

  return {
    createRefreshToken,
    findValidRefreshToken,
    deleteRefreshToken,
    deleteAllUserRefreshTokens,
  };
};
