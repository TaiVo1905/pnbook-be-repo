import postRepository from '@/shared/repositories/post.repository.js';
import postAttachmentRepository from '@/shared/repositories/postAttachment.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import userRepository from '@/shared/repositories/user.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import {
  checkOwnership,
  checkDeletePermission,
} from '@/utils/authorization.util.js';
import firestoreService from '@/infrastructure/firestore.service.js';
import { POSTS_MESSAGES } from './posts.messages.js';
import type { CreatePostRequestDto } from './dtos/createPostRequest.dto.js';
import type { NotificationRequestDto } from '../notifications/dtos/notificationRequest.dto.js';
import type { GetPostRequestDto } from './dtos/getPostRequest.dto.js';
import type { UpdatePostRequestDto } from './dtos/updatePostRequest.dto.js';
import type { ReactPostRequestDto } from './dtos/reactPostRequest.dto.js';

const hydrated = (posts: any[]) =>
  posts.map(({ reactions, ...rest }: any) => ({
    ...rest,
    reacted: reactions && reactions.length > 0,
  }));

const postsService = {
  create: async (createPostPayload: CreatePostRequestDto) => {
    const { posterId, content, originalPostId, attachments } =
      createPostPayload;

    if (
      originalPostId &&
      !(await postRepository.getById({ id: originalPostId, userId: posterId }))
    ) {
      throw new NotFoundError(POSTS_MESSAGES.ORIGINAL_POST_NOT_FOUND);
    }

    const post = await postRepository.create({
      posterId,
      content,
      originalPostId,
    });

    if (attachments && attachments.length > 0) {
      await postAttachmentRepository.createMany({
        postId: post.id,
        attachments,
      });
    }

    const friendConnections = await userRepository.getFriendIds(posterId);
    for (const friendId of friendConnections) {
      const notification: NotificationRequestDto = {
        receiverId: friendId,
        title: originalPostId
          ? POSTS_MESSAGES.NEW_REPOST_TITLE
          : POSTS_MESSAGES.NEW_POST_TITLE,
        content: originalPostId
          ? POSTS_MESSAGES.NEW_REPOST_CONTENT
          : POSTS_MESSAGES.NEW_POST_CONTENT,
        targetDetails: JSON.stringify({ postId: post.id, posterId }),
      };
      const filledNotification =
        await notificationRepository.create(notification);

      await firestoreService.triggerNotification({
        id: filledNotification.id,
        ...notification,
      });
    }

    return post;
  },

  getById: async (id: string, userId: string) => {
    const post = await postRepository.getById({ id, userId });
    if (!post || post.deletedAt)
      throw new NotFoundError(POSTS_MESSAGES.POST_NOT_FOUND);
    const hydratedPosts = hydrated([post]);
    return hydratedPosts[0];
  },

  getByPoster: async (getPostRequestDto: GetPostRequestDto) => {
    const { posts, count } =
      await postRepository.getByPoster(getPostRequestDto);

    const hydratedPosts = hydrated(posts);
    return { posts: hydratedPosts, count };
  },

  getFeeds: async (getPostRequestDto: GetPostRequestDto) => {
    const { posts, count } = await postRepository.getFeeds({
      userId: getPostRequestDto.posterId,
      page: getPostRequestDto.page,
      limit: getPostRequestDto.limit,
    });
    return { posts: hydrated(posts), count };
  },

  update: async (updatePostRequestDto: UpdatePostRequestDto) => {
    const existing = await postsService.getById(
      updatePostRequestDto.postId,
      updatePostRequestDto.actorId
    );
    checkOwnership(existing.posterId, updatePostRequestDto.actorId, 'post');
    return await postRepository.update({
      id: updatePostRequestDto.postId,
      content: updatePostRequestDto.content,
    });
  },

  remove: async (id: string, actorId: string) => {
    const existing = await postsService.getById(id, actorId);
    checkDeletePermission(existing.posterId, actorId, 'post');
    return await postRepository.remove(id);
  },

  listReactions: async (postId: string) => {
    return await postRepository.listReactions(postId);
  },

  react: async (reactPostRequestDto: ReactPostRequestDto) => {
    return await postRepository.react(reactPostRequestDto);
  },

  unreact: async (reactPostRequestDto: ReactPostRequestDto) => {
    return await postRepository.unreact(reactPostRequestDto);
  },
};

export default postsService;
