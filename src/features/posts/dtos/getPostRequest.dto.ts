export interface GetPostRequestDto {
  posterId?: string;
  userId: string;
  limit: number;
  page: number;
}
