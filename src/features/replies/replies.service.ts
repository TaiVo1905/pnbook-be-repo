import replyRepository from '@/shared/repositories/reply.repository.js';
import commentRepository from '@/shared/repositories/comment.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import { ForbiddenError, NotFoundError } from '@/core/apiError.js';

const repliesService = () => {
  const create = async (
    commentId: string,
    replierId: string,
    content: string
  ) => {
    if (!(await commentRepository.getById(commentId))) {
      throw new NotFoundError('Comment not found');
    }

    const reply = await replyRepository.create(commentId, replierId, content);

    const comment = await commentRepository.getById(commentId);
    if (comment && comment.commenterId !== replierId) {
      await notificationRepository.create({
        receiverId: comment.commenterId,
        title: 'New Reply',
        content: 'Someone replied to your comment',
        targetDetails: JSON.stringify({
          commentId,
          replyId: reply.id,
          replierId,
        }),
      });
    }

    return reply;
  };
  const listByComment = async (commentId: string, page = 1, limit = 20) => {
    const { list, count } = await replyRepository.listByComment(
      commentId,
      page,
      limit
    );
    return { list, count };
  };

  const update = async (id: string, actorId: string, content: string) => {
    const reply = await replyRepository.getById(id);
    if (!reply || reply.deletedAt) throw new NotFoundError('Reply not found');
    if (reply.replierId !== actorId)
      throw new ForbiddenError("Cannot edit others' reply");
    return await replyRepository.update(id, content);
  };

  const remove = async (id: string, actorId: string) => {
    const reply = await replyRepository.getById(id);
    if (!reply || reply.deletedAt) throw new NotFoundError('Reply not found');
    if (reply.replierId !== actorId)
      throw new ForbiddenError("Cannot delete others' reply");
    await replyRepository.remove(id);
  };
  return { create, listByComment, update, remove };
};

export default repliesService();
