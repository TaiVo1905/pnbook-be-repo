import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/edge.js';

const searchHistoryRepository = () => {
  const create = async (
    userId: string,
    keyword: string,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return await tx.searchHistory.create({
      data: { userId, keyword },
    });
  };

  const getByUser = async (userId: string, page = 1, limit = 20) => {
    const [histories, count] = await Promise.all([
      prisma.searchHistory.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.searchHistory.count({ where: { userId, deletedAt: null } }),
    ]);
    return { histories, count };
  };

  const deleteById = async (id: string) => {
    return await prisma.searchHistory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };

  const deleteAllByUser = async (userId: string) => {
    return await prisma.searchHistory.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  };

  return {
    create,
    getByUser,
    deleteById,
    deleteAllByUser,
  };
};

export default searchHistoryRepository();
