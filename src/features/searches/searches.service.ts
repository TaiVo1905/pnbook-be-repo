import searchHistoryRepository from '@/shared/repositories/searchHistory.repository.js';
import postRepository from '@/shared/repositories/post.repository.js';
import { prisma } from '@/utils/prisma.js';
import userRepository from '@/shared/repositories/user.repository.js';
import type {
  SearchHistoryRequestDto,
  DeleteSearchHistoryRequestDto,
  SearchRequestDto,
} from './dtos/searchRequest.dto.js';
import type { SearchHistoryResponse } from './searchHistory.response.js';
import type { UserResponse } from '../users/user.response.js';

const searchService = {
  searchPosts: async ({ userId, data }: SearchRequestDto) => {
    const result = await prisma.$transaction(async (tx) => {
      const { posts, count } = await postRepository.search(
        { userId, ...data },
        tx
      );
      await searchHistoryRepository.create(
        { userId, keyword: data.keyword },
        tx
      );
      return { posts, count };
    });

    return result;
  },

  searchUsers: async ({ userId, data }: SearchRequestDto) => {
    const result = await prisma.$transaction(async (tx) => {
      const { users, count } = await userRepository.searchByNameOrEmail(
        data,
        tx
      );
      await searchHistoryRepository.create(
        { userId, keyword: data.keyword },
        tx
      );
      const usersFiltered: UserResponse[] = users
        .filter((user) => user.id !== userId && !user.deletedAt)
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || null,
          createdAt: user.createdAt.toISOString(),
        }));
      return { users: usersFiltered, count };
    });

    return result;
  },
  getHistoryByUser: async (
    searchHistoryRequestDto: SearchHistoryRequestDto
  ) => {
    const histories = await searchHistoryRepository.getByUser(
      searchHistoryRequestDto
    );
    const formattedHistories: SearchHistoryResponse[] = histories.histories.map(
      (history) => ({
        id: history.id,
        keyword: history.keyword,
        createdAt: history.createdAt.toISOString(),
      })
    );
    return { histories: formattedHistories, count: histories.count };
  },
  deleteAllHistoryByUser: async (userId: string) => {
    await searchHistoryRepository.deleteAllByUser(userId);
  },
  deleteHistoryById: async (
    deleteSearchHistoryRequestDto: DeleteSearchHistoryRequestDto
  ) => {
    return await searchHistoryRepository.remove(deleteSearchHistoryRequestDto);
  },
};

export default searchService;
