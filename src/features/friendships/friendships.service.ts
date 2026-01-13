import { BadRequestError } from '@/core/apiError.js';
import firestoreService from '@/infrastructure/firestore.service.js';
import friendshipRepository from '@/shared/repositories/friendship.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import type { ListFriendsRequestDto } from './dtos/listFriendsRequest.dto.js';
import type { FriendDto } from './dtos/friend.dto.js';
import { FRIENDSHIPS_MESSAGES } from './friendships.messages.js';

const friendshipsService = {
  listMine: async (listFriendsRequestPayload: ListFriendsRequestDto) => {
    const { list, count } = await friendshipRepository.listMyFriends(
      listFriendsRequestPayload
    );
    return { list, count };
  },

  listOfUser: async (listFriendsRequestPayload: ListFriendsRequestDto) => {
    const { list, count } = await friendshipRepository.listFriendsOfUser(
      listFriendsRequestPayload
    );
    return { list, count };
  },

  listRequests: async (listFriendsRequestPayload: ListFriendsRequestDto) => {
    const { list, count } = await friendshipRepository.listFriendRequests(
      listFriendsRequestPayload
    );
    return { list, count };
  },

  sendRequest: async (sendFriendRequestPayload: FriendDto) => {
    const { requesterId, addresseeId } = sendFriendRequestPayload;
    if (requesterId === addresseeId) {
      throw new BadRequestError(FRIENDSHIPS_MESSAGES.CANNOT_SEND_TO_SELF);
    }

    if (
      await friendshipRepository.areFriends({
        userId: requesterId,
        friendId: addresseeId,
      })
    ) {
      throw new BadRequestError(FRIENDSHIPS_MESSAGES.ALREADY_FRIENDS);
    }
    const request = await friendshipRepository.sendFriendRequest(
      sendFriendRequestPayload
    );

    const notification = await notificationRepository.create({
      receiverId: addresseeId,
      title: FRIENDSHIPS_MESSAGES.FRIEND_REQUEST_TITLE,
      content: FRIENDSHIPS_MESSAGES.FRIEND_REQUEST_SENT_CONTENT,
      targetDetails: JSON.stringify({ requesterId }),
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: addresseeId,
      title: FRIENDSHIPS_MESSAGES.NEW_FRIEND_REQUEST_TITLE,
      content: FRIENDSHIPS_MESSAGES.NEW_FRIEND_REQUEST_CONTENT,
      targetDetails: JSON.stringify({ requesterId }),
    });

    return request;
  },

  updateStatus: async (
    userId: string,
    friendId: string,
    status: 'accepted' | 'block'
  ) => {
    return await friendshipRepository.updateFriendshipStatus({
      userId,
      friendId,
      status,
    });
  },

  remove: async (userId: string, friendId: string) => {
    await friendshipRepository.deleteFriendship({ userId, friendId });
  },

  acceptRequest: async (friend: FriendDto) => {
    await friendshipRepository.acceptFriendRequest({
      requesterId: friend.requesterId,
      addresseeId: friend.addresseeId,
    });

    const notification = await notificationRepository.create({
      receiverId: friend.requesterId,
      title: FRIENDSHIPS_MESSAGES.REQUEST_ACCEPTED_TITLE,
      content: FRIENDSHIPS_MESSAGES.REQUEST_ACCEPTED_CONTENT,
      targetDetails: JSON.stringify({ addresseeId: friend.addresseeId }),
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: friend.requesterId,
      title: FRIENDSHIPS_MESSAGES.REQUEST_ACCEPTED_TITLE,
      content: FRIENDSHIPS_MESSAGES.REQUEST_ACCEPTED_CONTENT,
      targetDetails: JSON.stringify({ addresseeId: friend.addresseeId }),
    });
  },

  rejectRequest: async (friend: FriendDto) => {
    await friendshipRepository.rejectFriendRequest({
      requesterId: friend.requesterId,
      addresseeId: friend.addresseeId,
    });
  },
};

export default friendshipsService;
