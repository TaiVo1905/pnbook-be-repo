import commentRepository from '@/shared/repositories/comment.repository.js';
import postRepository from '@/shared/repositories/post.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import {
  checkOwnership,
  checkDeletePermission,
} from '@/utils/authorization.util.js';
import { COMMENTS_MESSAGES } from './comments.messages.js';

const commentsService = {
  create: async (postId: string, commenterId: string, content: string) => {
    const comment = await commentRepository.create({
      postId,
      commenterId,
      content,
    });

    const post = await postRepository.getById({
      id: postId,
      userId: commenterId,
    });
    if (post && post.posterId !== commenterId) {
      await notificationRepository.create({
        receiverId: post.posterId,
        title: COMMENTS_MESSAGES.NEW_COMMENT_TITLE,
        content: COMMENTS_MESSAGES.NEW_COMMENT_CONTENT,
        targetDetails: JSON.stringify({
          postId,
          commentId: comment.id,
          commenterId,
        }),
      });
    }

    return comment;
  },
  listByPost: async (postId: string, page = 1, limit = 20) => {
    const { list, count } = await commentRepository.listByPost({
      postId,
      page,
      limit,
    });
    return { list, count };
  },
  update: async (id: string, actorId: string, content: string) => {
    const comment = await commentRepository.getById(id);
    if (!comment || comment.deletedAt)
      throw new NotFoundError(COMMENTS_MESSAGES.COMMENT_NOT_FOUND);
    checkOwnership(comment.commenterId, actorId, 'comment');
    return await commentRepository.update({ id, content });
  },
  remove: async (id: string, actorId: string) => {
    const comment = await commentRepository.getById(id);
    if (!comment || comment.deletedAt)
      throw new NotFoundError(COMMENTS_MESSAGES.COMMENT_NOT_FOUND);
    checkDeletePermission(comment.commenterId, actorId, 'comment');
    return await commentRepository.remove(id);
  },
};

export default commentsService;
