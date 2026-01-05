import { NotFoundError } from '@/core/apiError.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/edge.js';

const postRepository = () => {
  const create = async (
    posterId: string,
    content: string,
    originalPostId?: string
  ) => {
    return await prisma.post.create({
      data: { posterId, content, originalPostId: originalPostId || null },
    });
  };

  const getById = async (id: string, userId: string) => {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        poster: {
          select: { id: true, name: true, avatarUrl: true },
        },
        attachments: { where: { deletedAt: null } },
        reactions: { where: { reactorId: userId, deletedAt: null } },

        _count: {
          select: {
            comments: { where: { deletedAt: null } },
            shares: { where: { deletedAt: null } },
          },
        },
      },
    });
  };

  const getByPoster = async (posterId: string, page = 1, limit = 20) => {
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId, deletedAt: null },
        include: {
          poster: {
            select: { id: true, name: true, avatarUrl: true },
          },
          attachments: { where: { deletedAt: null } },
          reactions: { where: { reactorId: posterId, deletedAt: null } },
          _count: {
            select: {
              comments: { where: { deletedAt: null } },
              shares: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where: { posterId, deletedAt: null } }),
    ]);
    return { posts, count };
  };

  const getFeeds = async (userId: string, page = 1, limit = 20) => {
    const friendEdges = await prisma.friendList.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        deletedAt: null,
        status: 'accepted',
      },
      select: { friendId: true, userId: true },
    });

    const friendIds = friendEdges.map((edge) =>
      edge.userId === userId ? edge.friendId : edge.userId
    );

    const ids = [userId, ...new Set(friendIds)].filter(Boolean);
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId: { in: ids }, deletedAt: null },
        include: {
          poster: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          attachments: { where: { deletedAt: null } },
          reactions: {
            where: { reactorId: userId, deletedAt: null },
            select: { id: true },
          },
          originalPost: {
            include: {
              poster: {
                select: { id: true, name: true, email: true, avatarUrl: true },
              },
              attachments: { where: { deletedAt: null } },
            },
          },
          _count: {
            select: {
              comments: { where: { deletedAt: null } },
              shares: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where: { posterId: { in: ids }, deletedAt: null } }),
    ]);
    return { posts, count };
  };

  const update = async (id: string, content: string) => {
    return await prisma.post.update({ where: { id }, data: { content } });
  };

  const deletePost = async (id: string) => {
    return await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };

  const listReactions = async (postId: string) => {
    return await prisma.postReaction.findMany({
      where: { postId, deletedAt: null },
    });
  };

  const react = async (postId: string, reactorId: string) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.deletedAt) {
      throw new NotFoundError('Post not found');
    }

    const existingReaction = await prisma.postReaction.findUnique({
      where: { postId_reactorId: { postId, reactorId } },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { reactionCount: { increment: 1 } },
    });

    if (existingReaction && existingReaction.deletedAt) {
      return await prisma.postReaction.update({
        where: { id: existingReaction.id },
        data: { deletedAt: null },
      });
    } else if (!existingReaction) {
      return await prisma.postReaction.create({
        data: { postId, reactorId },
      });
    }

    return existingReaction;
  };

  const unreact = async (postId: string, reactorId: string) => {
    const reaction = await prisma.postReaction.findUnique({
      where: { postId_reactorId: { postId, reactorId } },
    });

    if (!reaction) {
      throw new NotFoundError('Reaction not found');
    }

    await prisma.post.update({
      where: { id: postId },
      data: { reactionCount: { decrement: 1 } },
    });

    return await prisma.postReaction.update({
      where: { id: reaction.id },
      data: { deletedAt: new Date() },
    });
  };

  const search = async (
    keyword: string,
    page = 1,
    limit = 20,
    tx: Prisma.TransactionClient = prisma
  ) => {
    const [posts, count] = await Promise.all([
      tx.post.findMany({
        where: {
          deletedAt: null,
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        include: { attachments: { where: { deletedAt: null } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      tx.post.count({
        where: {
          deletedAt: null,
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      }),
    ]);
    return { posts, count };
  };

  return {
    create,
    getById,
    getByPoster,
    getFeeds,
    update,
    deletePost,
    listReactions,
    react,
    unreact,
    search,
  };
};

export default postRepository();
