import userRepository from '@/shared/repositories/user.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import { USERS_MESSAGES } from './users.messages.js';
import type { UserResponse } from './user.response.js';
import type { UpdateUserRequest } from './dtos/updateUserRequest.dto.js';

const usersService = {
  getById: async (id: string): Promise<UserResponse> => {
    const user = await userRepository.findById(id);
    if (!user || user.deletedAt)
      throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt.toISOString(),
    };
    return userResponse;
  },

  updateById: async (
    updatedUserRequest: UpdateUserRequest
  ): Promise<UserResponse> => {
    await usersService.getById(updatedUserRequest.userId);
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
  },

  getSuggestions: async (userId: string): Promise<UserResponse[]> => {
    const suggestions = await userRepository.findSuggestions(userId);
    return suggestions.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt.toISOString(),
    }));
  },
};

export default usersService;
