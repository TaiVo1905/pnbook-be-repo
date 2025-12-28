import { NotFoundError } from '@/core/apiError.js';
import { prisma } from '@/utils/prisma.js';

const friendshipRepository = () => {
  const listFriendsOfUser = async (userId: string, page = 1, limit = 20) => {
    const [list, count] = await Promise.all([
      prisma.friendList.findMany({
        where: { userId, deletedAt: null },
        include: { friend: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.friendList.count({
        where: { userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  };

  const listMyFriends = async (userId: string, page = 1, limit = 20) =>
    listFriendsOfUser(userId, page, limit);

  const listFriendRequests = async (userId: string, page = 1, limit = 20) => {
    const [list, count] = await Promise.all([
      prisma.friendRequest.findMany({
        where: { addresseeId: userId, deletedAt: null },
        include: { requester: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.friendRequest.count({
        where: { addresseeId: userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  };

  const sendFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    return await prisma.friendRequest.create({
      data: { requesterId, addresseeId },
    });
  };

  const acceptFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    return await prisma.$transaction(async (tx) => {
      const fr = await tx.friendRequest.findUnique({
        where: { requesterId_addresseeId: { requesterId, addresseeId } },
      });
      if (!fr || fr.deletedAt) {
        throw new NotFoundError('Friend request not found');
      }

      await tx.friendRequest.update({
        where: { requesterId_addresseeId: { requesterId, addresseeId } },
        data: { deletedAt: new Date() },
      });

      await tx.friendList.upsert({
        where: {
          userId_friendId: { userId: addresseeId, friendId: requesterId },
        },
        update: { status: 'accepted', deletedAt: null },
        create: {
          userId: addresseeId,
          friendId: requesterId,
          status: 'accepted',
        },
      });
      await tx.friendList.upsert({
        where: {
          userId_friendId: { userId: requesterId, friendId: addresseeId },
        },
        update: { status: 'accepted', deletedAt: null },
        create: {
          userId: requesterId,
          friendId: addresseeId,
          status: 'accepted',
        },
      });

      return { accepted: true, requesterId, addresseeId };
    });
  };

  const rejectFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    return await prisma.friendRequest.updateMany({
      where: { requesterId, addresseeId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  };

  const updateFriendshipStatus = async (
    userId: string,
    friendId: string,
    status: 'accepted' | 'block'
  ) => {
    const [primary] = await prisma.$transaction([
      prisma.friendList.upsert({
        where: { userId_friendId: { userId, friendId } },
        update: { status },
        create: { userId, friendId, status },
      }),
      prisma.friendList.upsert({
        where: { userId_friendId: { userId: friendId, friendId: userId } },
        update: { status },
        create: { userId: friendId, friendId: userId, status },
      }),
    ]);
    return primary;
  };

  const deleteFriendship = async (userId: string, friendId: string) => {
    const deletedAt = new Date();
    const [primaryFriendship] = await prisma.$transaction([
      prisma.friendList.update({
        where: { userId_friendId: { userId, friendId } },
        data: { deletedAt },
      }),
      prisma.friendList.updateMany({
        where: {
          userId: friendId,
          friendId: userId,
          deletedAt: null,
        },
        data: { deletedAt },
      }),
    ]);
    return primaryFriendship;
  };

  const areFriends = async (userId: string, friendId: string) => {
    const friendship = await prisma.friendList.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        status: 'accepted',
        deletedAt: null,
      },
    });
    return !!friendship;
  };

  return {
    listFriendsOfUser,
    listMyFriends,
    listFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    updateFriendshipStatus,
    deleteFriendship,
    areFriends,
  };
};

export default friendshipRepository();
