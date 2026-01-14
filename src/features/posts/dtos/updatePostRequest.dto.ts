export interface UpdatePostRequestDto {
  postId: string;
  actorId: string;
  content: string;
  attachments?: Array<{
    attachmentUrl: string;
    attachmentType: 'image' | 'video' | 'audio';
  }>;
}
