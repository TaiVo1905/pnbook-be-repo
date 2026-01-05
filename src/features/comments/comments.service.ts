import commentRepository from '@/shared/repositories/comment.repository.js';
import postRepository from '@/shared/repositories/post.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import { ForbiddenError, NotFoundError } from '@/core/apiError.js';

const commentsService = () => {
  const create = async (
    postId: string,
    commenterId: string,
    content: string
  ) => {
    const comment = await commentRepository.create(
      postId,
      commenterId,
      content
    );

    const post = await postRepository.getById(postId, commenterId);
    if (post && post.posterId !== commenterId) {
      await notificationRepository.create({
        receiverId: post.posterId,
        title: 'New Comment',
        content: 'Someone commented on your post',
        targetDetails: JSON.stringify({
          postId,
          commentId: comment.id,
          commenterId,
        }),
      });
    }

    return comment;
  };
  const listByPost = async (postId: string, page = 1, limit = 20) => {
    const { list, count } = await commentRepository.listByPost(
      postId,
      page,
      limit
    );
    return { list, count };
  };
  const update = async (id: string, actorId: string, content: string) => {
    const comment = await commentRepository.getById(id);
    if (!comment || comment.deletedAt)
      throw new NotFoundError('Comment not found');
    if (comment.commenterId !== actorId)
      throw new ForbiddenError("Cannot edit others' comment");
    return await commentRepository.update(id, content);
  };
  const remove = async (id: string, actorId: string) => {
    const comment = await commentRepository.getById(id);
    if (!comment || comment.deletedAt)
      throw new NotFoundError('Comment not found');
    if (comment.commenterId !== actorId)
      throw new ForbiddenError("Cannot delete others' comment");
    return await commentRepository.remove(id);
  };
  return { create, listByPost, update, remove };
};

export default commentsService();
