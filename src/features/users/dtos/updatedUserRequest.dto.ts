export interface UpdatedUserRequest {
  userId: string;
  data: {
    name?: string;
    avatarUrl?: string;
  };
}
