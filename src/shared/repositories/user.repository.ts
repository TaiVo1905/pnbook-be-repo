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

  const findByIdWithFriendship = async (
    id: string,
    currentUserId: string
  ): Promise<any> => {
    return await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        friendOf: {
          where: {
            OR: [
              { friendId: currentUserId, userId: id },
              { userId: currentUserId, friendId: id },
            ],
            deletedAt: null,
          },
        },
        sentFriendRequests: {
          where: {
            requesterId: id,
            addresseeId: currentUserId,
            deletedAt: null,
          },
        },
        receivedFriendRequests: {
          where: {
            requesterId: currentUserId,
            addresseeId: id,
            deletedAt: null,
          },
        },
      },
    });
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

  const searchByNameOrEmail = async (
    keyword: string,
    page = 1,
    limit = 10,
    tx: Prisma.TransactionClient = prisma
  ) => {
    const [users, count] = await Promise.all([
      tx.user.findMany({
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
      tx.user.count({
        where: {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
      }),
    ]);
    return { users, count };
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
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
        status: 'accepted',
        deletedAt: null,
      },
      select: { friendId: true, userId: true },
    });
    return [
      ...new Set(
        friends.map((f) => (f.userId === userId ? f.friendId : f.userId))
      ),
    ];
  };

  const findSuggestions = async (userId: string) => {
    const suggestions = await prisma.user.findMany({
      where: {
        id: { not: userId },
        deletedAt: null,
        AND: [
          {
            friendOf: {
              none: {
                OR: [
                  { userId: userId, deletedAt: null },
                  { friendId: userId, deletedAt: null },
                ],
              },
            },
          },
          {
            sentFriendRequests: {
              none: {
                addresseeId: userId,
                deletedAt: null,
              },
            },
          },
          {
            receivedFriendRequests: {
              none: {
                requesterId: userId,
                deletedAt: null,
              },
            },
          },
        ],
      },
      take: Math.max(10, Math.floor(Math.random() * 20)),
      orderBy: { createdAt: 'desc' },
    });
    return suggestions;
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
    findByIdWithFriendship,
    findSuggestions,
  };
};

export default userRepository();
