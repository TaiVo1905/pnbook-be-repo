import postRepository from '@/shared/repositories/post.repository.js';
import postAttachmentRepository from '@/shared/repositories/postAttachment.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import userRepository from '@/shared/repositories/user.repository.js';
import { ForbiddenError, NotFoundError } from '@/core/apiError.js';
import firestoreService from '@/infrastructure/firestore.service.js';

const postsService = () => {
  const hydrated = (posts: any[]) =>
    posts.map(({ reactions, ...rest }: any) => ({
      ...rest,
      reacted: reactions && reactions.length > 0,
    }));
  const create = async (
    posterId: string,
    content: string,
    originalPostId?: string,
    attachments?: Array<{
      attachmentUrl: string;
      type: 'image' | 'video' | 'audio';
    }>
  ) => {
    if (
      originalPostId &&
      !(await postRepository.getById(originalPostId, posterId))
    ) {
      throw new NotFoundError('Original post not found');
    }

    const post = await postRepository.create(posterId, content, originalPostId);
    if (attachments && attachments.length > 0) {
      await postAttachmentRepository.createMany(post.id, attachments);
    }

    const friendConnections = await userRepository.getFriendIds(posterId);
    for (const friendId of friendConnections) {
      const notification = await notificationRepository.create({
        receiverId: friendId,
        title: originalPostId ? 'New Repost' : 'New Post',
        content: originalPostId
          ? 'Your friend reposted something new'
          : 'Your friend posted something new',
        targetDetails: JSON.stringify({ postId: post.id, posterId }),
      });

      await firestoreService.triggerNotification({
        id: notification.id,
        receiverId: friendId,
        title: originalPostId ? 'New Repost' : 'New Post',
        content: originalPostId
          ? 'Your friend reposted something new'
          : 'Your friend posted something new',
        targetDetails: JSON.stringify({ postId: post.id, posterId }),
      });
    }

    return post;
  };

  const getById = async (id: string, userId: string) => {
    const post = await postRepository.getById(id, userId);
    if (!post || post.deletedAt) throw new NotFoundError('Post not found');
    const hydratedPosts = hydrated([post]);
    return hydratedPosts[0];
  };

  const getByPoster = async (posterId: string, page = 1, limit = 20) => {
    const { posts, count } = await postRepository.getByPoster(
      posterId,
      page,
      limit
    );
    const hydratedPosts = hydrated(posts);

    return { posts: hydratedPosts, count };
  };

  const getFeeds = async (userId: string, page = 1, limit = 20) => {
    const { posts, count } = await postRepository.getFeeds(userId, page, limit);
    const hydratedPosts = hydrated(posts);

    return { posts: hydratedPosts, count };
  };

  const update = async (id: string, actorId: string, content: string) => {
    const existing = await getById(id, actorId);
    if (existing.posterId !== actorId) {
      throw new ForbiddenError("Cannot edit others' post");
    }
    return await postRepository.update(id, content);
  };

  const remove = async (id: string, actorId: string) => {
    const existing = await getById(id, actorId);
    if (existing.posterId !== actorId) {
      throw new ForbiddenError("Cannot delete others' post");
    }
    return await postRepository.deletePost(id);
  };

  const listReactions = async (postId: string) => {
    return await postRepository.listReactions(postId);
  };

  const react = async (postId: string, reactorId: string) => {
    return await postRepository.react(postId, reactorId);
  };

  const unreact = async (postId: string, reactorId: string) => {
    return await postRepository.unreact(postId, reactorId);
  };

  return {
    create,
    getById,
    getByPoster,
    getFeeds,
    update,
    remove,
    listReactions,
    react,
    unreact,
  };
};

export default postsService();
