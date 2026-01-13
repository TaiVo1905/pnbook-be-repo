import type {
  CreateCommentParams,
  ListByPostParams,
  UpdateCommentParams,
} from '@/shared/dtos/repositories/comment.repository.dto.js';
import { prisma } from '@/utils/prisma.js';

const commentRepository = {
  create: async (createCommentParams: CreateCommentParams) => {
    return await prisma.comment.create({
      data: { ...createCommentParams },
      include: {
        commenter: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  listByPost: async (listByPostParams: ListByPostParams) => {
    const [list, count] = await Promise.all([
      prisma.comment.findMany({
        where: { postId: listByPostParams.postId, deletedAt: null },
        include: {
          commenter: { select: { id: true, name: true, avatarUrl: true } },
          _count: {
            select: {
              replies: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (listByPostParams.page - 1) * listByPostParams.limit,
        take: listByPostParams.limit,
      }),
      prisma.comment.count({
        where: { postId: listByPostParams.postId, deletedAt: null },
      }),
    ]);
    return { list, count };
  },

  getById: async (id: string) => {
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
  },

  update: async (updateCommentParams: UpdateCommentParams) => {
    return await prisma.comment.update({
      where: { id: updateCommentParams.id },
      data: { content: updateCommentParams.content },
      include: {
        commenter: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  remove: async (id: string) => {
    return await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};

export default commentRepository;
