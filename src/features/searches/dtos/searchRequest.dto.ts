interface SearchPayload {
  keyword: string;
  page: number;
  limit: number;
}
export interface SearchRequestDto {
  userId: string;
  data: SearchPayload;
}

export interface SearchHistoryRequestDto {
  userId: string;
  page: number;
  limit: number;
}

export interface DeleteSearchHistoryRequestDto {
  id: string;
  userId: string;
}
