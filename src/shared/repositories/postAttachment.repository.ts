import type {
  CreateAttachmentParams,
  CreateManyAttachmentsParams,
} from '@/shared/dtos/repositories/postAttachment.repository.dto.js';
import { prisma } from '@/utils/prisma.js';

const postAttachmentRepository = {
  create: async (createAttachmentParams: CreateAttachmentParams) => {
    return await prisma.postAttachment.create({
      data: { ...createAttachmentParams },
    });
  },

  createMany: async (
    createManyAttachmentsParams: CreateManyAttachmentsParams
  ) => {
    return await prisma.postAttachment.createMany({
      data: createManyAttachmentsParams.attachments.map((a) => ({
        postId: createManyAttachmentsParams.postId,
        attachmentUrl: a.attachmentUrl,
        attachmentType: a.attachmentType,
      })),
    });
  },

  getById: async (postId: string) => {
    return await prisma.postAttachment.findMany({
      where: { postId, deletedAt: null },
    });
  },
};

export default postAttachmentRepository;
