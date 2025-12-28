import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/index.js';

const userRepository = () => {
  const findByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
  };

  const findById = async (id: string) => {
    return await prisma.user.findUnique({ where: { id, deletedAt: null } });
  };

  const create = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  };

  const updateById = async (
    id: string,
    data: Partial<{
      name: string;
      password: string;
      avatarUrl: string;
    }>
  ) => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  };

  const searchByNameOrEmail = async (keyword: string, page = 1, limit = 10) => {
    const [results, count] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({
        where: {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
      }),
    ]);
    return { results, count };
  };

  const updateWithGoogleAuth = async (
    userId: string,
    userInfoResponse: GoogleUserInfo,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return await tx.user.update({
      where: { id: userId },
      data: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
      },
    });
  };

  const upsertWithGoogleAuth = async (
    userInfoResponse: GoogleUserInfo,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return await tx.user.upsert({
      where: { email: userInfoResponse.email },
      update: {
        name: userInfoResponse.name,
        avatarUrl: userInfoResponse.picture,
      },
      create: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
      },
    });
  };

  const getFriendIds = async (userId: string) => {
    const friends = await prisma.friendList.findMany({
      where: { userId, status: 'accepted', deletedAt: null },
      select: { friendId: true },
    });
    return friends.map((f) => f.friendId);
  };

  return {
    findByEmail,
    findById,
    searchByNameOrEmail,
    updateById,
    create,
    updateWithGoogleAuth,
    upsertWithGoogleAuth,
    getFriendIds,
  };
};

export default userRepository();
