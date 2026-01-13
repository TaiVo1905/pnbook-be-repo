export interface CommentResponse {
  id: string;
  postId: string;
  commenterId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CommentListResponse {
  list: CommentResponse[];
  count: number;
}
