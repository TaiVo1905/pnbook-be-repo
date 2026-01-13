export interface NotificationRequestDto {
  id: string;
  receiverId: string;
  title: string;
  content: string;
  targetDetails: string | null;
}
