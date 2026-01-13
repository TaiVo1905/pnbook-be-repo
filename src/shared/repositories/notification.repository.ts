import type {
  CreateNotificationParams,
  ListNotificationsParams,
  MarkAsReadParams,
} from '@/shared/dtos/repositories/notification.repository.dto.js';
import { prisma } from '@/utils/prisma.js';
import firestoreService from '@/infrastructure/firestore.service.js';

const notificationRepository = {
  create: async (createNotificationParams: CreateNotificationParams) => {
    const notification = await prisma.notification.create({
      data: {
        receiverId: createNotificationParams.receiverId,
        title: createNotificationParams.title,
        content: createNotificationParams.content,
        targetDetails: createNotificationParams.targetDetails || null,
      },
    });

    await firestoreService.triggerNotification({
      id: notification.id,
      receiverId: notification.receiverId,
      title: notification.title,
      content: notification.content,
      targetDetails: notification.targetDetails || null,
    });

    return notification;
  },

  listMine: async (listNotificationsParams: ListNotificationsParams) => {
    const [list, count] = await Promise.all([
      prisma.notification.findMany({
        where: { receiverId: listNotificationsParams.userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip:
          (listNotificationsParams.page - 1) * listNotificationsParams.limit,
        take: listNotificationsParams.limit,
      }),
      prisma.notification.count({
        where: { receiverId: listNotificationsParams.userId, deletedAt: null },
      }),
    ]);
    return { list, count };
  },

  markAsRead: async (markAsReadParams: MarkAsReadParams) => {
    return await prisma.notification.updateMany({
      where: {
        id: markAsReadParams.id,
        receiverId: markAsReadParams.userId,
        deletedAt: null,
      },
      data: { isRead: true },
    });
  },
};

export default notificationRepository;
