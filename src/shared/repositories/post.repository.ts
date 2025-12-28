import { prisma } from '@/utils/prisma.js';

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

  const getById = async (id: string) => {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        attachments: { where: { deletedAt: null } },
        reactions: { where: { deletedAt: null } },
        comments: { where: { deletedAt: null } },
      },
    });
  };

  const getByPoster = async (posterId: string, page = 1, limit = 20) => {
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId, deletedAt: null },
        include: { attachments: { where: { deletedAt: null } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where: { posterId, deletedAt: null } }),
    ]);
    return { posts, count };
  };

  const getFeeds = async (userId: string, page = 1, limit = 20) => {
    const friendIds = await prisma.friendList.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        deletedAt: null,
        status: 'accepted',
      },
      select: { friendId: true },
    });
    const ids = [
      userId,
      ...friendIds.map((f) => f.friendId).filter((id) => id !== userId),
    ];
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: { posterId: { in: ids }, deletedAt: null },
        include: { attachments: { where: { deletedAt: null } } },
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

  return {
    create,
    getById,
    getByPoster,
    getFeeds,
    update,
    deletePost,
    listReactions,
  };
};

export default postRepository();
