import { prisma } from '@/utils/prisma.js';
import firestoreService from '@/infrastructure/firestore.service.js';

const notificationRepository = () => {
  const create = async (data: {
    receiverId: string;
    title: string;
    content: string;
    targetDetails?: string;
  }) => {
    const notification = await prisma.notification.create({
      data: {
        receiverId: data.receiverId,
        title: data.title,
        content: data.content,
        targetDetails: data.targetDetails || null,
      },
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: notification.receiverId,
      title: notification.title,
      content: notification.content,
      targetDetails: notification.targetDetails || undefined,
    });

    return notification;
  };

  const listMine = async (userId: string, page = 1, limit = 20) => {
    const [list, count] = await Promise.all([
      prisma.notification.findMany({
        where: { receiverId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({
        where: { receiverId: userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  };

  const markAsRead = async (id: string, userId: string) => {
    return await prisma.notification.updateMany({
      where: { id, receiverId: userId, deletedAt: null },
      data: { isRead: true },
    });
  };

  return { create, listMine, markAsRead };
};

export default notificationRepository();
