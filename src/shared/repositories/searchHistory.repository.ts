import type {
  CreateSearchHistoryParams,
  ListSearchHistoryParams,
  DeleteSearchHistoryParams,
} from '@/shared/dtos/repositories/searchHistory.repository.dto.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/edge.js';

const searchHistoryRepository = {
  create: async (
    createSearchHistoryParams: CreateSearchHistoryParams,
    tx: Prisma.TransactionClient = prisma
  ) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSearch = await tx.searchHistory.findFirst({
      where: {
        ...createSearchHistoryParams,
        createdAt: { gte: fiveMinutesAgo },
        deletedAt: null,
      },
    });

    if (recentSearch) {
      return recentSearch;
    }

    return await tx.searchHistory.create({
      data: { ...createSearchHistoryParams },
    });
  },

  getByUser: async (listSearchHistoryParams: ListSearchHistoryParams) => {
    const [histories, count] = await Promise.all([
      prisma.searchHistory.findMany({
        where: { userId: listSearchHistoryParams.userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip:
          (listSearchHistoryParams.page - 1) * listSearchHistoryParams.limit,
        take: listSearchHistoryParams.limit,
      }),
      prisma.searchHistory.count({
        where: { userId: listSearchHistoryParams.userId, deletedAt: null },
      }),
    ]);
    return { histories, count };
  },

  remove: async (deleteSearchHistoryParams: DeleteSearchHistoryParams) => {
    return await prisma.searchHistory.updateMany({
      where: { ...deleteSearchHistoryParams, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  deleteAllByUser: async (userId: string) => {
    return await prisma.searchHistory.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};

export default searchHistoryRepository;
