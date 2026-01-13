export interface CreateSearchHistoryParams {
  userId: string;
  keyword: string;
}

export interface ListSearchHistoryParams {
  userId: string;
  page: number;
  limit: number;
}

export interface DeleteSearchHistoryParams {
  id: string;
  userId: string;
}

export interface SearchParams {
  userId: string;
  keyword: string;
  page: number;
  limit: number;
}
