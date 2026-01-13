import notificationRepository from '@/shared/repositories/notification.repository.js';
import type { listNotificationRequestDto } from './dtos/listNotificationRequest.dto.js';
import type { MarkAsReadPayRequestDto } from './dtos/MarkAsReadRequest.dto.js';

const notificationsService = {
  listMine: async (listNotificationPayload: listNotificationRequestDto) => {
    const { list, count } = await notificationRepository.listMine(
      listNotificationPayload
    );
    return { list, count };
  },

  markAsRead: async (markAsReadPayload: MarkAsReadPayRequestDto) => {
    const result = await notificationRepository.markAsRead(markAsReadPayload);
    return result;
  },
};

export default notificationsService;
