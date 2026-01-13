export interface MessageRequestDto {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  contentType: 'text' | 'attachment';
}
