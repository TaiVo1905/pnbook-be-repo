import { prisma } from '@/utils/prisma.js';

const replyRepository = () => {
  const create = async (
    commentId: string,
    replierId: string,
    content: string
  ) => {
    return await prisma.reply.create({
      data: { commentId, replierId, content },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  };
  const listByComment = async (commentId: string, page = 1, limit = 20) => {
    const [list, count] = await Promise.all([
      prisma.reply.findMany({
        where: { commentId, deletedAt: null },
        include: {
          replier: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.reply.count({
        where: { commentId, deletedAt: null },
      }),
    ]);
    return { list, count };
  };
  const getById = async (id: string) => {
    return await prisma.reply.findUnique({
      where: { id },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  };
  const update = async (id: string, content: string) => {
    return await prisma.reply.update({
      where: { id },
      data: { content },
      include: {
        replier: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  };
  const remove = async (id: string) => {
    return await prisma.reply.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
  return { create, listByComment, getById, update, remove };
};

export default replyRepository();
