import { prisma } from '@/utils/prisma.js';

const postAttachmentRepository = () => {
  const create = async (
    postId: string,
    attachmentUrl: string,
    attachmentType: 'image' | 'video' | 'audio'
  ) => {
    return await prisma.postAttachment.create({
      data: { postId, attachmentUrl, attachmentType },
    });
  };

  const createMany = async (
    postId: string,
    attachments: Array<{ key: string; type: 'image' | 'video' | 'audio' }>
  ) => {
    return await prisma.postAttachment.createMany({
      data: attachments.map((a) => ({
        postId,
        attachmentUrl: a.key,
        attachmentType: a.type,
      })),
    });
  };

  const getById = async (postId: string) => {
    return await prisma.postAttachment.findMany({
      where: { postId, deletedAt: null },
    });
  };

  return { create, createMany, getById };
};

export default postAttachmentRepository();
