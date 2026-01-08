import userRepository from '@/shared/repositories/user.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import type { UserResponse } from '@/features/users/User.response.js';
import type { UpdatedUserRequest } from './dtos/updatedUserRequest.dto.js';

const usersService = () => {
  const getByIdWithFriendship = async (id: string, currentUserId: string) => {
    const user = await userRepository.findByIdWithFriendship(id, currentUserId);
    if (id === currentUserId) {
      throw new NotFoundError('Cannot get friendship status with yourself');
    }
    if (!user || user.deletedAt) throw new NotFoundError('User not found');

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      relationshipStatus: {
        isFriend: user.friendOf.length > 0 ? true : false,
        sentFriendRequest: user?.sentFriendRequests.length > 0 ? true : false,
        receivedFriendRequest:
          user?.receivedFriendRequests.length > 0 ? true : false,
      },
      createdAt: user.createdAt.toISOString(),
    };
    return userResponse;
  };

  const updateById = async (
    updatedUserRequest: UpdatedUserRequest
  ): Promise<UserResponse> => {
    await userRepository.findById(updatedUserRequest.userId);
    const updatedUser = await userRepository.updateById(
      updatedUserRequest.userId,
      updatedUserRequest.data
    );
    const userResponse: UserResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl || null,
      createdAt: updatedUser.createdAt.toISOString(),
    };
    return userResponse;
  };

  const getMe = async (id: string): Promise<UserResponse> => {
    const user = await userRepository.findById(id);
    if (!user || user.deletedAt) throw new NotFoundError('User not found');
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt.toISOString(),
    };
    return userResponse;
  };

  const getSuggestions = async (userId: string): Promise<UserResponse[]> => {
    const suggestions = await userRepository.findSuggestions(userId);
    return suggestions.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt.toISOString(),
    }));
  };

  return { getByIdWithFriendship, updateById, getMe, getSuggestions };
};

export default usersService();
