import { BadRequestError } from '@/core/apiError.js';
import firestoreService from '@/infrastructure/firestore.service.js';
import friendshipRepository from '@/shared/repositories/friendship.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';

const friendshipsService = () => {
  const listMine = async (userId: string, page: number, limit: number) => {
    const { list, count } = await friendshipRepository.listMyFriends(
      userId,
      page,
      limit
    );
    return { list, count };
  };

  const listOfUser = async (userId: string, page: number, limit: number) => {
    const { list, count } = await friendshipRepository.listFriendsOfUser(
      userId,
      page,
      limit
    );
    return { list, count };
  };

  const listRequests = async (userId: string, page = 1, limit = 20) => {
    const { list, count } = await friendshipRepository.listFriendRequests(
      userId,
      page,
      limit
    );
    return { list, count };
  };

  const sendRequest = async (requesterId: string, addresseeId: string) => {
    if (requesterId === addresseeId) {
      throw new BadRequestError('Cannot send friend request to yourself');
    }

    if (await friendshipRepository.areFriends(requesterId, addresseeId)) {
      throw new BadRequestError('You are already friends with this user');
    }
    const request = await friendshipRepository.sendFriendRequest(
      requesterId,
      addresseeId
    );

    const notification = await notificationRepository.create({
      receiverId: addresseeId,
      title: 'Friend Request',
      content: 'Someone sent you a friend request',
      targetDetails: JSON.stringify({ requesterId }),
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: addresseeId,
      title: 'New Friend Request',
      content: 'You have received a new friend request',
      targetDetails: JSON.stringify({ requesterId }),
    });

    return request;
  };

  const updateStatus = async (
    userId: string,
    friendId: string,
    status: 'accepted' | 'block'
  ) => {
    return await friendshipRepository.updateFriendshipStatus(
      userId,
      friendId,
      status
    );
  };

  const remove = async (userId: string, friendId: string) => {
    await friendshipRepository.deleteFriendship(userId, friendId);
  };

  const acceptRequest = async (requesterId: string, addresseeId: string) => {
    await friendshipRepository.acceptFriendRequest(requesterId, addresseeId);

    const notification = await notificationRepository.create({
      receiverId: requesterId,
      title: 'Friend Request Accepted',
      content: 'Your friend request was accepted',
      targetDetails: JSON.stringify({ addresseeId }),
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: requesterId,
      title: 'Friend Request Accepted',
      content: 'Your friend request was accepted',
      targetDetails: JSON.stringify({ addresseeId }),
    });
  };

  const rejectRequest = async (requesterId: string, addresseeId: string) => {
    await friendshipRepository.rejectFriendRequest(requesterId, addresseeId);
  };
  return {
    listMine,
    listOfUser,
    listRequests,
    sendRequest,
    updateStatus,
    remove,
    acceptRequest,
    rejectRequest,
  };
};

export default friendshipsService();
