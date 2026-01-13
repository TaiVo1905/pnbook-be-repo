export interface CreateReplyParams {
  commentId: string;
  replierId: string;
  content: string;
}

export interface ListRepliesParams {
  commentId: string;
  page: number;
  limit: number;
}

export interface UpdateReplyParams {
  id: string;
  content: string;
}
