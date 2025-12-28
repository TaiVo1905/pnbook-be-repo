import userRepository from '@/shared/repositories/user.repository.js';
import { NotFoundError } from '@/core/apiError.js';

const usersService = () => {
  const getById = async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user || user.deletedAt) throw new NotFoundError('User not found');
    return user;
  };

  const updateById = async (
    id: string,
    data: { name?: string; avatarUrl?: string }
  ) => {
    await getById(id);
    return await userRepository.updateById(id, data);
  };

  const search = async (keyword: string, page = 1, limit = 20) => {
    const { users, count } = await userRepository.searchByNameOrEmail(
      keyword,
      page,
      limit
    );
    return { users, count };
  };

  return { getById, updateById, search };
};

export default usersService();
