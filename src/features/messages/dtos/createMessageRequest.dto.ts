export interface createMessageRequestDto {
  senderId: string;
  receiverId: string;
  content: string;
  contentType: 'text' | 'attachment';
}
