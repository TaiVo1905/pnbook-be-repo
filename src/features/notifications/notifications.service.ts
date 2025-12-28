import notificationRepository from '@/shared/repositories/notification.repository.js';

const notificationsService = () => {
  const listMine = async (userId: string, page = 1, limit = 20) => {
    const { list, count } = await notificationRepository.listMine(
      userId,
      page,
      limit
    );
    return { list, count };
  };
  const markAsRead = async (id: string, userId: string) => {
    const result = await notificationRepository.markAsRead(id, userId);
    return result;
  };
  return { listMine, markAsRead };
};

export default notificationsService();
