import type {
  CreateReplyParams,
  ListRepliesParams,
  UpdateReplyParams,
} from '@/shared/dtos/repositories/reply.repository.dto.js';
import { prisma } from '@/utils/prisma.js';

const replyRepository = {
  create: async (createReplyParams: CreateReplyParams) => {
    return await prisma.reply.create({
      data: { ...createReplyParams },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  listByComment: async (listRepliesParams: ListRepliesParams) => {
    const [list, count] = await Promise.all([
      prisma.reply.findMany({
        where: { commentId: listRepliesParams.commentId, deletedAt: null },
        include: {
          replier: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (listRepliesParams.page - 1) * listRepliesParams.limit,
        take: listRepliesParams.limit,
      }),
      prisma.reply.count({
        where: { commentId: listRepliesParams.commentId, deletedAt: null },
      }),
    ]);
    return { list, count };
  },

  getById: async (id: string) => {
    return await prisma.reply.findUnique({
      where: { id },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  update: async (updateReplyParams: UpdateReplyParams) => {
    return await prisma.reply.update({
      where: { id: updateReplyParams.id },
      data: { content: updateReplyParams.content },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  remove: async (id: string) => {
    return await prisma.reply.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};

export default replyRepository;
