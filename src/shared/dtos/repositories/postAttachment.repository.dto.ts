export interface CreateAttachmentParams {
  postId: string;
  attachmentUrl: string;
  attachmentType: 'image' | 'video' | 'audio';
}

export interface CreateManyAttachmentsParams {
  postId: string;
  attachments: Array<{
    attachmentUrl: string;
    attachmentType: 'image' | 'video' | 'audio';
  }>;
}
