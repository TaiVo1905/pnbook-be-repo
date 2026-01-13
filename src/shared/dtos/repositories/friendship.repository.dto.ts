export interface FriendshipStatusParams {
  userId: string;
  friendId: string;
  status?: 'accepted' | 'block';
}

export interface ListFriendsParams {
  userId: string;
  page: number;
  limit: number;
}

export interface FriendRequestParams {
  addresseeId: string;
  requesterId: string;
}
