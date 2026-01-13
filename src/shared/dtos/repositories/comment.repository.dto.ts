export interface CreateCommentParams {
  postId: string;
  commenterId: string;
  content: string;
}

export interface ListByPostParams {
  postId: string;
  page: number;
  limit: number;
}

export interface UpdateCommentParams {
  id: string;
  content: string;
}
