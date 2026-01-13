interface UpdateUserPayload {
  name?: string;
  avatarUrl?: string;
}

export interface UpdateUserRequest {
  userId: string;
  data: UpdateUserPayload;
}
