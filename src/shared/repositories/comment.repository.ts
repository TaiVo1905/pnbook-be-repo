import { prisma } from '@/utils/prisma.js';

const commentRepository = () => {
  const create = async (
    postId: string,
    commenterId: string,
    content: string
  ) => {
    return await prisma.comment.create({
      data: { postId, commenterId, content },
      include: {
        commenter: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  };
  const listByPost = async (postId: string, page = 1, limit = 20) => {
    const [list, count] = await Promise.all([
      prisma.comment.findMany({
        where: { postId, deletedAt: null },
        include: {
          commenter: { select: { id: true, name: true, avatarUrl: true } },
          _count: {
            select: {
              replies: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where: { postId, deletedAt: null } }),
    ]);
    return { list, count };
  };
  const getById = async (id: string) => {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        commenter: { select: { id: true, name: true, avatarUrl: true } },
        _count: {
          select: {
            replies: { where: { deletedAt: null } },
          },
        },
      },
    });
  };
  const update = async (id: string, content: string) => {
    return await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        commenter: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  };
  const remove = async (id: string) => {
    return await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };
  return { create, listByPost, getById, update, remove };
};

export default commentRepository();
