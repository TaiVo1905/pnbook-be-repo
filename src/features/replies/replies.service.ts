import replyRepository from '@/shared/repositories/reply.repository.js';
import commentRepository from '@/shared/repositories/comment.repository.js';
import notificationRepository from '@/shared/repositories/notification.repository.js';
import { NotFoundError } from '@/core/apiError.js';
import {
  checkOwnership,
  checkDeletePermission,
} from '@/utils/authorization.util.js';
import type { CreateReplyRequestDto } from './dtos/createReplyRequest.dto.js';
import type { GetRepliesRequestDto } from './dtos/getRepliesRequest.dto.js';
import type { UpdateReplyRequestDto } from './dtos/updateReplyRequest.dto.js';
import { REPLIES_MESSAGES } from './replies.messages.js';

const repliesService = {
  create: async (createReplyPayload: CreateReplyRequestDto) => {
    if (!(await commentRepository.getById(createReplyPayload.commentId))) {
      throw new NotFoundError(REPLIES_MESSAGES.COMMENT_NOT_FOUND);
    }

    const reply = await replyRepository.create(createReplyPayload);

    const comment = await commentRepository.getById(
      createReplyPayload.commentId
    );
    if (comment && comment.commenterId !== createReplyPayload.replierId) {
      await notificationRepository.create({
        receiverId: comment.commenterId,
        title: REPLIES_MESSAGES.NEW_REPLY_TITLE,
        content: REPLIES_MESSAGES.NEW_REPLY_CONTENT,
        targetDetails: JSON.stringify({
          commentId: createReplyPayload.commentId,
          replyId: reply.id,
          replierId: createReplyPayload.replierId,
        }),
      });
    }

    return reply;
  },
  listByComment: async (getRepliesRequestDto: GetRepliesRequestDto) => {
    const { list, count } =
      await replyRepository.listByComment(getRepliesRequestDto);
    return { list, count };
  },

  update: async (updateReplyRequestDto: UpdateReplyRequestDto) => {
    const reply = await replyRepository.getById(updateReplyRequestDto.replyId);
    if (!reply || reply.deletedAt)
      throw new NotFoundError(REPLIES_MESSAGES.REPLY_NOT_FOUND);
    checkOwnership(reply.replierId, updateReplyRequestDto.replierId, 'reply');
    return await replyRepository.update({
      id: updateReplyRequestDto.replyId,
      content: updateReplyRequestDto.content,
    });
  },

  remove: async (id: string, actorId: string) => {
    const reply = await replyRepository.getById(id);
    if (!reply || reply.deletedAt)
      throw new NotFoundError(REPLIES_MESSAGES.REPLY_NOT_FOUND);
    checkDeletePermission(reply.replierId, actorId, 'reply');
    await replyRepository.remove(id);
  },
};

export default repliesService;
