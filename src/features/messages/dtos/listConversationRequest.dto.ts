export interface ListConversationRequestDto {
  senderId: string;
  receiverId: string;
  page: number;
  limit: number;
}
