export interface CreateNotificationParams {
  receiverId: string;
  title: string;
  content: string;
  targetDetails: string;
}

export interface ListNotificationsParams {
  userId: string;
  page: number;
  limit: number;
}

export interface MarkAsReadParams {
  id: string;
  userId: string;
}
