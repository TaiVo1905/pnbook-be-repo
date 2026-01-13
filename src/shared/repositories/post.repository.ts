import type {
  CreatePostParams,
  GetByPosterParams,
  GetFeedsParams,
  UpdatePostParams,
  PostReactionParams,
} from '@/shared/dtos/repositories/post.repository.dto.js';
import { NotFoundError } from '@/core/apiError.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/edge.js';
import type { SearchParams } from '../dtos/repositories/searchHistory.repository.dto.js';

const postRepository = {
  create: async (createPostParams: CreatePostParams) => {
    return await prisma.post.create({
      data: {
        posterId: createPostParams.posterId,
        content: createPostParams.content,
        originalPostId: createPostParams.originalPostId || null,
      },
    });
  },

  getById: async ({ id, userId }: { id: string; userId: string }) => {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        poster: {
          select: { id: true, name: true, avatarUrl: true },
        },
        attachments: { where: { deletedAt: null } },
        reactions: { where: { reactorId: userId, deletedAt: null } },
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
    });
  },

  getByPoster: async (getByPosterParams: GetByPosterParams) => {
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId: getByPosterParams.posterId, deletedAt: null },
        include: {
          poster: {
            select: { id: true, name: true, avatarUrl: true },
          },
          attachments: { where: { deletedAt: null } },
          reactions: {
            where: { reactorId: getByPosterParams.userId, deletedAt: null },
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
        skip: (getByPosterParams.page - 1) * getByPosterParams.limit,
        take: getByPosterParams.limit,
      }),
      prisma.post.count({
        where: { posterId: getByPosterParams.posterId, deletedAt: null },
      }),
    ]);
    return { posts, count };
  },

  getFeeds: async (getFeedsParams: GetFeedsParams) => {
    const friendEdges = await prisma.friendList.findMany({
      where: {
        OR: [
          { userId: getFeedsParams.userId },
          { friendId: getFeedsParams.userId },
        ],
        deletedAt: null,
        status: 'accepted',
      },
      select: { friendId: true, userId: true },
    });
    const friendIds = friendEdges.map((edge) =>
      edge.userId === getFeedsParams.userId ? edge.friendId : edge.userId
    );

    const ids = [getFeedsParams.userId, ...new Set(friendIds)].filter(Boolean);

    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId: { in: ids }, deletedAt: null },
        include: {
          poster: {
            select: { id: true, name: true, avatarUrl: true },
          },
          attachments: {
            where: { deletedAt: null },
          },
          reactions: {
            where: { reactorId: getFeedsParams.userId, deletedAt: null },
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
        skip: (getFeedsParams.page - 1) * getFeedsParams.limit,
        take: getFeedsParams.limit,
      }),
      prisma.post.count({ where: { posterId: { in: ids }, deletedAt: null } }),
    ]);
    return { posts, count };
  },

  update: async (updatePostParams: UpdatePostParams) => {
    return await prisma.post.update({
      where: { id: updatePostParams.id },
      data: { content: updatePostParams.content },
    });
  },

  remove: async (id: string) => {
    return await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  listReactions: async (postId: string) => {
    return await prisma.postReaction.findMany({
      where: { postId, deletedAt: null },
    });
  },

  react: async (postReactionParams: PostReactionParams) => {
    const post = await prisma.post.findUnique({
      where: { id: postReactionParams.postId },
    });
    if (!post || post.deletedAt) {
      throw new NotFoundError('Post not found');
    }

    const existingReaction = await prisma.postReaction.findUnique({
      where: { postId_reactorId: { ...postReactionParams } },
    });

    await prisma.post.update({
      where: { id: postReactionParams.postId },
      data: { reactionCount: { increment: 1 } },
    });

    if (existingReaction && existingReaction.deletedAt) {
      return await prisma.postReaction.update({
        where: { id: existingReaction.id },
        data: { deletedAt: null },
      });
    } else if (!existingReaction) {
      return await prisma.postReaction.create({
        data: { ...postReactionParams },
      });
    }

    return existingReaction;
  },

  unreact: async (postReactionParams: PostReactionParams) => {
    const reaction = await prisma.postReaction.findUnique({
      where: { postId_reactorId: { ...postReactionParams } },
    });

    if (!reaction) {
      throw new NotFoundError('Reaction not found');
    }

    await prisma.post.update({
      where: { id: postReactionParams.postId },
      data: { reactionCount: { decrement: 1 } },
    });

    return await prisma.postReaction.update({
      where: { id: reaction.id },
      data: { deletedAt: new Date() },
    });
  },

  search: async (
    searchParams: SearchParams,
    tx: Prisma.TransactionClient = prisma
  ) => {
    const [posts, count] = await Promise.all([
      tx.post.findMany({
        where: {
          deletedAt: null,
          content: {
            contains: searchParams.keyword,
            mode: 'insensitive',
          },
        },
        include: {
          poster: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          attachments: { where: { deletedAt: null } },
          reactions: {
            where: { reactorId: searchParams.userId, deletedAt: null },
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
        skip: (searchParams.page - 1) * searchParams.limit,
        take: searchParams.limit,
      }),
      tx.post.count({
        where: {
          deletedAt: null,
          content: {
            contains: searchParams.keyword,
            mode: 'insensitive',
          },
        },
      }),
    ]);
    return { posts, count };
  },
};

export default postRepository;
