export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserParams {
  id: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
}

export interface SearchUserParams {
  keyword: string;
  page: number;
  limit: number;
}
