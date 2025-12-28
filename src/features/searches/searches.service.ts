import searchHistoryRepository from '@/shared/repositories/searchHistory.repository.js';
import postRepository from '@/shared/repositories/post.repository.js';
import { prisma } from '@/utils/prisma.js';
import userRepository from '@/shared/repositories/user.repository.js';

const searchService = () => {
  const searchPosts = async (
    userId: string,
    keyword: string,
    page = 1,
    limit = 20
  ) => {
    const result = await prisma.$transaction(async (tx) => {
      const { posts, count } = await postRepository.search(
        keyword,
        page,
        limit,
        tx
      );
      if (page === 1) {
        await searchHistoryRepository.create(userId, keyword, tx);
      }
      return { posts, count };
    });

    return result;
  };

  const searchUsers = async (
    userId: string,
    keyword: string,
    page = 1,
    limit = 20
  ) => {
    const result = await prisma.$transaction(async (tx) => {
      const { users, count } = await userRepository.searchByNameOrEmail(
        keyword,
        page,
        limit,
        tx
      );
      if (page === 1) {
        await searchHistoryRepository.create(userId, keyword, tx);
      }
      return { users, count };
    });

    return result;
  };

  return { searchPosts, searchUsers };
};

export default searchService();
