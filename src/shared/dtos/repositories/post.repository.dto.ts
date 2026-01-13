export interface CreatePostParams {
  posterId: string;
  content: string;
  originalPostId?: string;
}

export interface GetByPosterParams {
  posterId: string;
  userId: string;
  page: number;
  limit: number;
}

export interface GetFeedsParams {
  userId: string;
  page: number;
  limit: number;
}

export interface UpdatePostParams {
  id: string;
  content: string;
}

export interface PostReactionParams {
  postId: string;
  reactorId: string;
}
