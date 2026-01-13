export interface CreatePostRequestDto {
  posterId: string;
  content: string;
  originalPostId?: string;
  attachments: Array<{
    attachmentUrl: string;
    attachmentType: 'image' | 'video' | 'audio';
  }>;
}
