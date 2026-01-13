export interface ListConversationParams {
  senderId: string;
  receiverId: string;
  page: number;
  limit: number;
}

export interface ListConversationsParams {
  userId: string;
  page: number;
  limit: number;
}

export interface CreateMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
  contentType: 'text' | 'attachment';
}

export interface UpdateMessageParams {
  id: string;
  content: string;
}
