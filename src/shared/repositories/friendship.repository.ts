import type {
  FriendshipStatusParams,
  ListFriendsParams,
  FriendRequestParams,
} from '@/shared/dtos/repositories/friendship.repository.dto.js';
import { NotFoundError } from '@/core/apiError.js';
import { prisma } from '@/utils/prisma.js';

const friendshipRepository = {
  listFriendsOfUser: async (listFriendsParams: ListFriendsParams) => {
    const [list, count] = await Promise.all([
      prisma.friendList.findMany({
        where: { userId: listFriendsParams.userId, deletedAt: null },
        include: { friend: true },
        orderBy: { createdAt: 'desc' },
        skip: (listFriendsParams.page - 1) * listFriendsParams.limit,
        take: listFriendsParams.limit,
      }),
      prisma.friendList.count({
        where: { userId: listFriendsParams.userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  },

  listMyFriends: async (listFriendsParams: ListFriendsParams) =>
    friendshipRepository.listFriendsOfUser(listFriendsParams),

  listFriendRequests: async (listFriendsParams: ListFriendsParams) => {
    const [list, count] = await Promise.all([
      prisma.friendRequest.findMany({
        where: { addresseeId: listFriendsParams.userId, deletedAt: null },
        include: { requester: true },
        orderBy: { createdAt: 'desc' },
        skip: (listFriendsParams.page - 1) * listFriendsParams.limit,
        take: listFriendsParams.limit,
      }),
      prisma.friendRequest.count({
        where: { addresseeId: listFriendsParams.userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  },

  sendFriendRequest: async (friendRequestParams: FriendRequestParams) => {
    return await prisma.friendRequest.create({
      data: { ...friendRequestParams },
    });
  },

  acceptFriendRequest: async (friendRequestParams: FriendRequestParams) => {
    return await prisma.$transaction(async (tx) => {
      const fr = await tx.friendRequest.findUnique({
        where: { requesterId_addresseeId: { ...friendRequestParams } },
      });
      if (!fr || fr.deletedAt) {
        throw new NotFoundError('Friend request not found');
      }

      await tx.friendRequest.update({
        where: { requesterId_addresseeId: { ...friendRequestParams } },
        data: { deletedAt: new Date() },
      });

      await tx.friendList.upsert({
        where: {
          userId_friendId: {
            userId: friendRequestParams.addresseeId,
            friendId: friendRequestParams.requesterId,
          },
        },
        update: { status: 'accepted', deletedAt: null },
        create: {
          userId: friendRequestParams.addresseeId,
          friendId: friendRequestParams.requesterId,
          status: 'accepted',
        },
      });
      await tx.friendList.upsert({
        where: {
          userId_friendId: {
            userId: friendRequestParams.requesterId,
            friendId: friendRequestParams.addresseeId,
          },
        },
        update: { status: 'accepted', deletedAt: null },
        create: {
          userId: friendRequestParams.requesterId,
          friendId: friendRequestParams.addresseeId,
          status: 'accepted',
        },
      });

      return {
        accepted: true,
        requesterId: friendRequestParams.requesterId,
        addresseeId: friendRequestParams.addresseeId,
      };
    });
  },

  rejectFriendRequest: async (friendRequestParams: FriendRequestParams) => {
    return await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          {
            requesterId: friendRequestParams.requesterId,
            addresseeId: friendRequestParams.addresseeId,
            deletedAt: null,
          },
          {
            requesterId: friendRequestParams.addresseeId,
            addresseeId: friendRequestParams.requesterId,
            deletedAt: null,
          },
        ],
      },
    });
  },

  updateFriendshipStatus: async (
    friendshipStatusParams: FriendshipStatusParams
  ) => {
    const [primary] = await prisma.$transaction([
      prisma.friendList.upsert({
        where: {
          userId_friendId: {
            userId: friendshipStatusParams.userId,
            friendId: friendshipStatusParams.friendId,
          },
        },
        update: { status: friendshipStatusParams.status! },
        create: {
          userId: friendshipStatusParams.userId,
          friendId: friendshipStatusParams.friendId,
          status: friendshipStatusParams.status!,
        },
      }),
      prisma.friendList.upsert({
        where: {
          userId_friendId: {
            userId: friendshipStatusParams.friendId,
            friendId: friendshipStatusParams.userId,
          },
        },
        update: { status: friendshipStatusParams.status },
        create: {
          userId: friendshipStatusParams.friendId,
          friendId: friendshipStatusParams.userId,
          status: friendshipStatusParams.status!,
        },
      }),
    ]);
    return primary;
  },

  deleteFriendship: async (friendshipStatusParams: FriendshipStatusParams) => {
    const deletedAt = new Date();
    const [primaryFriendship] = await prisma.$transaction([
      prisma.friendList.update({
        where: { userId_friendId: { ...friendshipStatusParams } },
        data: { deletedAt },
      }),
      prisma.friendList.updateMany({
        where: {
          userId: friendshipStatusParams.friendId,
          friendId: friendshipStatusParams.userId,
          deletedAt: null,
        },
        data: { deletedAt },
      }),
    ]);
    return primaryFriendship;
  },

  areFriends: async (friendshipStatusParams: FriendshipStatusParams) => {
    const friendship = await prisma.friendList.findFirst({
      where: {
        OR: [
          { ...friendshipStatusParams },
          {
            userId: friendshipStatusParams.friendId,
            friendId: friendshipStatusParams.userId,
          },
        ],
        status: 'accepted',
        deletedAt: null,
      },
    });
    return !!friendship;
  },
};

export default friendshipRepository;
