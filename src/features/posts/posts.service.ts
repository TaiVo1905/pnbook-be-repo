import postRepository from '@/shared/repositories/post.repository.js';
import postAttachmentRepository from '@/shared/repositories/postAttachment.repository.js';
import uploadsService from '@/features/uploads/uploads.service.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import userRepository from '@/shared/repositories/user.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import firestoreService from '@/infrastructure/firestore.service.js';

const postsService = () => {
  const hydrateAttachments = async (
    attachments: Array<{
      id: string;
      attachmentUrl: string;
      attachmentType: string;
    }>
  ) => {
    return await Promise.all(
      attachments.map(async (att) => ({
        id: att.id,
        type: att.attachmentType,
        url: await uploadsService.getLimitedTimeUrl(att.attachmentUrl),
      }))
    );
  };

  const hydratePost = async (post: any) => {
    if (post.attachments && post.attachments.length > 0) {
      post.attachments = await hydrateAttachments(post.attachments);
    }
    return post;
  };

  const create = async (
    posterId: string,
    content: string,
    originalPostId?: string,
    attachments?: Array<{ key: string; type: 'image' | 'video' | 'audio' }>
  ) => {
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

  const getById = async (id: string) => {
    const post = await postRepository.getById(id);
    if (!post || post.deletedAt) throw new NotFoundError('Post not found');
    return await hydratePost(post);
  };

  const getByPoster = async (posterId: string, page = 1, limit = 20) => {
    const { posts, count } = await postRepository.getByPoster(
      posterId,
      page,
      limit
    );
    const filledPosts = await Promise.all(posts.map((p) => hydratePost(p)));
    return { posts: filledPosts, count };
  };

  const getFeeds = async (userId: string, page = 1, limit = 20) => {
    const { posts, count } = await postRepository.getFeeds(userId, page, limit);
    const filledPosts = await Promise.all(posts.map((p) => hydratePost(p)));
    return { posts: filledPosts, count };
  };

  const update = async (id: string, actorId: string, content: string) => {
    const existing = await getById(id);
    if (existing.posterId !== actorId) {
      throw new Error("Forbidden: cannot edit others' post");
    }
    return await postRepository.update(id, content);
  };

  const remove = async (id: string, actorId: string) => {
    const existing = await getById(id);
    if (existing.posterId !== actorId) {
      throw new Error("Forbidden: cannot delete others' post");
    }
    return await postRepository.deletePost(id);
  };

  const listReactions = async (postId: string) => {
    return await postRepository.listReactions(postId);
  };

  return {
    create,
    getById,
    getByPoster,
    getFeeds,
    update,
    remove,
    listReactions,
  };
};

export default postsService();
